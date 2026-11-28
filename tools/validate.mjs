// SEO Quality Gate (automated part of docs/seo/SEO-QUALITY-GATE.md).  Works on a packaged folder (dist/ or dist-preview/).
//   node tools/validate.mjs --dir dist-preview [--mode preview|production] [--pages tests/fixtures/pages]
// production mode: every finding marked (P) is an ERROR; in preview they are warnings.  Exit code 1 on any error.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPages } from './build.mjs';
import { allowedNumbers } from '../templates/prices.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const a = process.argv.slice(2), get = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const dir = isAbsolute(get('--dir') || '') ? get('--dir') : join(root, get('--dir') || 'dist'), mode = get('--mode') || 'production';
const extra = a.flatMap((x, i) => x === '--pages' ? [a[i + 1]] : []);
const site = JSON.parse(readFileSync(join(root, 'data/site.json'), 'utf8')), prices = JSON.parse(readFileSync(join(root, 'data/prices.json'), 'utf8'));
const pagesData = loadPages(['data/pages', ...extra]);
const errors = [], warns = [];
const E = m => errors.push(m), W = m => warns.push(m);
const P = m => (mode === 'production' ? E : W)(m); // placeholder-type problems: fatal only in production

const htmlFiles = []; (function w(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? w(f) : n.endsWith('.html') && htmlFiles.push(f); } })(dir);
const urlOf = f => '/' + relative(dir, f).split(sep).join('/').replace(/index\.html$/, '');
const pages = htmlFiles.map(f => ({ f, url: urlOf(f), html: readFileSync(f, 'utf8').replace(/\r\n/g, '\n') }));
const byUrl = new Map(pages.map(p => [p.url, p]));
const generated = new Map(); for (const p of Object.values(pagesData)) for (const l of ['es', 'en']) if (p[l]) generated.set(p[l].url, { page: p, lang: l });
const exists = u => { const p = decodeURIComponent(u.split('#')[0].split('?')[0]); const f = join(dir, p); return (existsSync(f) && statSync(f).isFile()) || (p.endsWith('/') && existsSync(join(f, 'index.html'))); };
const attr = (s, re) => (s.match(re) || [])[1];

const titles = new Map(), descs = new Map(), inbound = new Map(), kws = new Map();
const allowedPrices = allowedNumbers(prices); // net + consumer (VAT-included) amounts derived from data/prices.json by templates/prices.mjs

for (const pg of pages) {
  const g = generated.get(pg.url), h = pg.html, tag = pg.url;
  if (!g) continue; // existing (protected) pages are only used as link targets here
  const { page, lang } = g, L = page[lang];
  const title = attr(h, /<title>([^<]*)<\/title>/), desc = attr(h, /<meta name="description" content="([^"]*)"/);
  if (!title || title.length < 20 || title.length > 70) W(`${tag}: title length ${title?.length}`);
  if (!desc || desc.length < 60 || desc.length > 165) W(`${tag}: description length ${desc?.length}`);
  (titles.get(title) || titles.set(title, []).get(title)).push(tag); (descs.get(desc) || descs.set(desc, []).get(desc)).push(tag);
  if ((h.match(/<h1[ >]/g) || []).length !== 1) E(`${tag}: must have exactly one h1`);
  if (attr(h, /<html lang="([^"]+)"/) !== lang) E(`${tag}: html lang mismatch`);
  if (attr(h, /<link rel="canonical" href="([^"]+)"/) !== site.domain + L.url) E(`${tag}: canonical is not self-referencing`);
  // hreflang reciprocity
  const hl = [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]);
  if (page.es && page.en) {
    const want = { es: site.domain + page.es.url, en: site.domain + page.en.url, 'x-default': site.domain + page.es.url };
    for (const [k, v] of Object.entries(want)) if (!hl.some(([l, u]) => l === k && u === v)) E(`${tag}: hreflang ${k} missing/incorrect`);
  } else W(`${tag}: no language counterpart (hreflang omitted) - ES/EN pair required before publishing`);
  // robots vs status
  const robots = attr(h, /<meta name="robots" content="([^"]+)"/);
  const shouldIndex = mode === 'production' && site.indexableStatuses.includes(page.status);
  if (shouldIndex !== robots.startsWith('index')) E(`${tag}: robots "${robots}" inconsistent with status "${page.status}" / mode ${mode}`);
  if (mode === 'production' && !site.indexableStatuses.includes(page.status)) E(`${tag}: status "${page.status}" must not be in a production build`);
  // JSON-LD
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]); } catch { E(`${tag}: invalid JSON-LD`); return null; } }).filter(Boolean);
  const ids = new Set(ld.flatMap(j => (j['@graph'] || [j]).map(n => n['@id']))), refs = JSON.stringify(ld).match(/"@id":"[^"]+"/g) || [];
  for (const r of new Set(refs)) { const id = r.slice(7, -1); if (!ids.has(id)) E(`${tag}: JSON-LD @id reference not defined: ${id}`); }
  if (/AggregateRating|"Review"/.test(JSON.stringify(ld))) E(`${tag}: AggregateRating/Review markup is forbidden`);
  // images
  for (const m of h.matchAll(/<img\b([^>]*)>/g)) { const t = m[1]; if (!/\salt="/.test(t)) E(`${tag}: <img> without alt`); if (!/\swidth="\d+"/.test(t) || !/\sheight="\d+"/.test(t)) E(`${tag}: <img> without width/height`); const s = attr(t, /\ssrc="([^"]+)"/); if (s && s.startsWith('/') && !exists(s)) E(`${tag}: image file missing ${s}`); }
  // fix pack 1 gates: unique ids, no repeated image in a page (author portrait excepted), no pre-filled WhatsApp text, no per-bedroom price wording in meta
  const idl = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]), dupIds = [...new Set(idl.filter((x, i) => idl.indexOf(x) !== i))]; if (dupIds.length) E(`${tag}: duplicate id(s) ${dupIds.join(', ')}`);
  const body = (h.match(/<main[\s\S]*<\/main>/) || [h])[0].replace(/<aside class="sx-author"[\s\S]*?<\/aside>/, ''), imgl = [...body.matchAll(/data-image-id="([^"]+)"|<img\b[^>]*\ssrc="([^"]+)"/g)].map(m => m[1] || m[2].replace(/-\d+\.\w+$/, '')), dupImg = [...new Set(imgl.filter((x, i) => imgl.indexOf(x) !== i))]; if (dupImg.length) E(`${tag}: same image used more than once on the page: ${dupImg.join(', ')}`);
  { const tels = [...new Set([...h.matchAll(/href="tel:([^"]+)"/g)].map(m => m[1]))], was = [...new Set([...h.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)].map(m => m[1]))];
    if (tels.some(t => t !== site.dispatcher.tel)) E(`${tag}: tel: link is not the approved dispatcher number (${tels.join(', ')})`);
    if (was.some(w => w !== site.whatsapp.url)) E(`${tag}: WhatsApp link is not the approved WhatsApp URL (${was.join(', ')})`);
    if (h.includes(site.whatsapp.display) && h.includes(`tel:${site.whatsapp.number}`)) E(`${tag}: WhatsApp number used as a phone CTA`); }
  if (!(prices.vat.status === 'approved' || prices.vat.displayApprovedByOwner === true) && /(\d[\d.,]*\s?€|€\s?\d)/.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) P(`${tag}: shows a price while VAT/consumer price presentation is not final (P)`);
  if (/\{\{[a-z]+:?\w*\}\}/.test(h)) E(`${tag}: unresolved {{token}}`);
  if (/D[eé]nia/.test(h)) E(`${tag}: Dénia is not an approved service town`);
  if (/wa\.me\/\d+\?/.test(h)) E(`${tag}: WhatsApp link with pre-filled text (owner decision: none)`);
  if (/(?:por|per) (?:dormitorio|bedroom)/i.test(desc || '')) E(`${tag}: meta description implies a per-bedroom price (the chemical price is per treatment, depending on the bedrooms affected)`);
  const ph = (h.match(/class="sx-ph/g) || []).length; if (ph) P(`${tag}: ${ph} image placeholder(s) left (P)`);
  const todos = (h.match(/data-owner-todo/g) || []).length; if (todos) P(`${tag}: ${todos} owner-input block(s) left (P)`);
  // links
  for (const m of h.matchAll(/<a\b[^>]*\shref="([^"]+)"([^>]*)>/g)) {
    const u = m[1];
    if (/^(tel:|mailto:|https?:\/\/(?!www\.controldechinches\.es))/.test(u)) { if ((/^tel:/.test(u) || /wa\.me/.test(u)) && !/data-cta=/.test(m[0])) E(`${tag}: phone/WhatsApp link without data-cta`); continue; }
    if (u.startsWith('#')) { if (u.length > 1 && !h.includes(`id="${u.slice(1)}"`)) E(`${tag}: missing anchor ${u}`); continue; }
    const target = u.replace(site.domain, '');
    if (!exists(target)) { if (!/__fixture__/.test(target) || mode === 'production') E(`${tag}: broken link ${u}`); else W(`${tag}: link to fixture page not built ${u}`); continue; }
    const key = target.split('#')[0]; if (key !== tag) { const s = inbound.get(key) || new Set(); s.add(tag); inbound.set(key, s); }
  }
  // prices & claims
  const text = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const m of text.matchAll(/(\d[\d.,]*)\s?€|€\s?(\d[\d.,]*)/g)) { const n = (m[1] || m[2]).replace(/[.,]$/, ''); if (!allowedPrices.has(n)) E(`${tag}: price "${m[0]}" is not in data/prices.json`); }
  if (/Esencial|Completo/.test(text)) E(`${tag}: retired plan names`);
  // "100 %" is only a promise when attached to an outcome word; reported study results ("100 % mortality") are fine
  for (const m of text.matchAll(/garantiz|garantía de|100 ?% (?:efic|garant|segur|éxito|effective|success|safe)|sin riesgo|guarantee[sd]?\b|risk-free/gi)) {
    const before = text.slice(Math.max(0, m.index - 90), m.index); // a negated mention ("does not guarantee") is allowed
    if (!/\b(no|ni|not|nor|never|nunca|without|cannot|none|ninguna|ninguno|ning[uú]n|nada|neither)\b[^.]*$/i.test(before)) E(`${tag}: forbidden claim wording "${m[0]}" (guarantee/100%/risk-free) unless negated`);
  }
  if ((text.match(/profesional|professional/gi) || []).length > 2) W(`${tag}: "profesional/professional" used more than twice - prefer concrete facts`);
  if (L.primaryKeyword) (kws.get(L.primaryKeyword.toLowerCase() + '|' + lang) || kws.set(L.primaryKeyword.toLowerCase() + '|' + lang, []).get(L.primaryKeyword.toLowerCase() + '|' + lang)).push(tag);
  if (page.template === 'T-C' && !(L.sources || []).length) P(`${tag}: article without sources (P)`);
  if (page.template === 'T-C' && !L.reviewer) W(`${tag}: article without independent professional reviewer (allowed by owner decision D-050: none exists and none is claimed)`);
  if (!site.indexableStatuses.includes(page.status) && mode === 'production') E(`${tag}: not approved`);
}
for (const [t, urls] of titles) if (urls.length > 1) E(`duplicate title "${t}": ${urls.join(', ')}`);
for (const [t, urls] of descs) if (urls.length > 1) E(`duplicate description: ${urls.join(', ')}`);
for (const [k, urls] of kws) if (urls.length > 1) E(`keyword cannibalization "${k}": ${urls.join(', ')}`);
if (mode === 'production') for (const [u] of generated) if (byUrl.has(u)) { const n = inbound.get(u)?.size || 0; if (n < 2) E(`${u}: orphan-ish page (${n} inbound links from built pages, need >= 2)`); }
else for (const [u] of generated) if (byUrl.has(u) && (inbound.get(u)?.size || 0) < 2 && !/__fixture__/.test(u)) W(`${u}: fewer than 2 inbound links (needed before publishing)`);

console.log(`validated ${pages.filter(p => generated.has(p.url)).length} generated pages (mode ${mode}, dir ${get('--dir') || 'dist'})`);
warns.forEach(w => console.log('  warn  ' + w));
errors.forEach(e => console.log('  ERROR ' + e));
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
