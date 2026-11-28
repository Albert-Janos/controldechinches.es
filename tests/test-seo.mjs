// Technical SEO audit of the PRODUCTION package: sitemap, canonical, hreflang reciprocity, html lang, robots, titles/descriptions/H1, structured data,
// images, internal links, noindex. Usage: node tests/test-seo.mjs   (no browser needed)
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { packageSite } from '../tools/package-site.mjs';
import { repoRoot } from '../tools/lib/browser.mjs';

const failures = []; const ok = (c, m) => { if (!c) { failures.push(m); console.log('  FAIL', m); } };
const warns = []; const warn = (c, m) => { if (!c) warns.push(m); };
const OUT = 'dist-seo-test';
packageSite({ mode: 'production', out: OUT, pageDirs: [] });
const dist = join(repoRoot, OUT), D = 'https://www.controldechinches.es';
const htmls = []; (function w(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? w(f) : n.endsWith('.html') && htmls.push(f); } })(dist);
const urlOf = f => { const r = '/' + relative(dist, f).split(sep).join('/'); return r.endsWith('/index.html') ? r.slice(0, -10) : r; };
const pages = {}; for (const f of htmls) pages[urlOf(f)] = readFileSync(f, 'utf8');
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8'), locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(D, ''));

const nonIndexable = new Set(Object.keys(pages).filter(u => /<meta name="robots"[^>]*noindex/i.test(pages[u])));
ok([...nonIndexable].sort().join() === ['/404.html', '/aviso-legal.html', '/gracias.html', '/politica-privacidad.html'].join(), `the only noindex pages are 404, thank-you and the two legal pages (legal placeholders pending): ${[...nonIndexable].sort()}`);
const indexable = Object.keys(pages).filter(u => !nonIndexable.has(u));
ok(locs.length === new Set(locs).size, 'sitemap has no duplicate URLs');
ok(locs.length === 86, `sitemap lists 86 URLs (43 ES + 43 EN): ${locs.length}`);
ok(locs.filter(u => u.startsWith('/en/') || u === '/en/').length === 43, 'sitemap: 43 English URLs');
ok(indexable.length === locs.length, `every generated/indexable HTML page is in the sitemap (${indexable.length} pages, ${locs.length} URLs)`);
for (const u of locs) ok(pages[u] !== undefined, `sitemap URL exists in the package: ${u}`);
for (const u of locs) { const h = pages[u]; if (!h) continue;
  const g = re => (h.match(re) || [])[1];
  ok(/<meta name="robots" content="index, follow">/.test(h) || /<meta name="robots" content="index,follow">/i.test(h) || !/noindex/i.test(h), `${u}: indexable page is not noindex`);
  ok(!/<meta name="robots"[^>]*noindex/i.test(h), `${u}: no noindex`);
  const canon = g(/<link rel="canonical" href="([^"]+)"/); ok(canon === D + u, `${u}: canonical is itself (${canon})`);
  const lang = g(/<html lang="([^"]+)"/); const isEn = u.startsWith('/en/') || u === '/en/'; ok(lang === (isEn ? 'en' : 'es'), `${u}: html lang ${lang}`);
  // hreflang: self + other + x-default, reciprocal
  const alts = [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2].replace(D, '')]);
  const map = Object.fromEntries(alts); ok(map[lang] === u && map[isEn ? 'es' : 'en'] && map['x-default'], `${u}: hreflang self, counterpart and x-default`);
  const other = map[isEn ? 'es' : 'en']; if (other) { ok(pages[other] !== undefined && locs.includes(other), `${u}: hreflang counterpart ${other} exists and is in the sitemap`); const back = [...(pages[other] || '').matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2].replace(D, '')]); ok(back.some(([l, h2]) => l === lang && h2 === u), `${u}: hreflang is reciprocal`); }
  // sitemap hreflang matches the page
  const block = sitemap.slice(sitemap.indexOf(`<loc>${D}${u}</loc>`), sitemap.indexOf('</url>', sitemap.indexOf(`<loc>${D}${u}</loc>`)));
  ok(other && block.includes(`href="${D}${other}"`), `${u}: sitemap hreflang matches the page`);
  // head essentials
  const title = g(/<title>([^<]*)<\/title>/), desc = g(/<meta name="description" content="([^"]*)"/), h1s = [...h.matchAll(/<h1\b/g)].length;
  ok(title && title.length >= 15, `${u}: title present`); ok(desc && desc.length >= 60, `${u}: meta description present`); ok(h1s === 1, `${u}: exactly one H1 (${h1s})`);
  warn(title && title.length <= 70, `${u}: title is ${title?.length} chars (> 70)`); warn(desc && desc.length <= 175, `${u}: description is ${desc?.length} chars (> 175)`);
  ok(/<meta property="og:title"/.test(h) && /<meta property="og:description"/.test(h) && /<meta property="og:url"/.test(h) && /<meta property="og:image"/.test(h), `${u}: Open Graph tags`);
  ok(!/localhost|127\.0\.0\.1|__dev|data-owner-todo|class="sx-draft"|Pendiente del propietario|TODO/.test(h), `${u}: no dev/draft/owner-note remnants`);
  ok(!/\{\{[a-z]+(:|\})/i.test(h.replace(/<script[\s\S]*?<\/script>/g, '')), `${u}: no unresolved tokens`);
  // structured data parses; no invented ratings, addresses or offices
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { let j; try { j = JSON.parse(m[1]); } catch (e) { ok(false, `${u}: invalid JSON-LD ${e.message}`); continue; }
    const s = JSON.stringify(j); ok(!/aggregateRating|"review"|ratingValue|streetAddress|LocalBusiness|"address"|openingHours/.test(s), `${u}: JSON-LD invents no ratings, reviews, addresses or business premises`); }
  // images: alt + dimensions
  for (const m of h.matchAll(/<img\b[^>]*>/g)) ok(/\salt="/.test(m[0]) && /\swidth="\d+"/.test(m[0]) && /\sheight="\d+"/.test(m[0]), `${u}: <img> has alt and dimensions`);
  // internal links resolve
  for (const m of h.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) { const t = m[1]; if (/\.(pdf|webp|avif|jpg|png|svg|css|js|xml|txt)$/i.test(t)) { ok(existsSync(join(dist, t)), `${u}: asset link exists ${t}`); continue; } const norm = t.endsWith('/') || t.endsWith('.html') ? t : t + '/'; ok(pages[norm] !== undefined || pages[t] !== undefined, `${u}: internal link resolves ${t}`); }
}
// uniqueness of titles / descriptions / H1 across the site
for (const [k, re] of [['title', /<title>([^<]*)<\/title>/], ['description', /<meta name="description" content="([^"]*)"/], ['h1', /<h1\b[^>]*>([\s\S]*?)<\/h1>/]]) {
  const seen = {}; for (const u of locs) { const v = (pages[u]?.match(re) || [])[1]?.replace(/<[^>]+>/g, '').trim(); if (!v) continue; (seen[v] ||= []).push(u); }
  for (const [v, us] of Object.entries(seen)) if (us.length > 1) ok(false, `duplicate ${k} "${v.slice(0, 60)}" on ${us.join(', ')}`);
}
// orphan check: every sitemap URL (except home) is linked from at least one other page
const inbound = {}; for (const u of locs) for (const m of (pages[u] || '').matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) (inbound[m[1]] ||= new Set()).add(u);
for (const u of locs) { const ins = [...(inbound[u] || [])].filter(x => x !== u); ok(ins.length > 0 || u === '/' || u === '/en/', `orphan page (no inbound internal link): ${u}`); }
// robots.txt / sitemap rules
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8'); ok(/Sitemap: https:\/\/www\.controldechinches\.es\/sitemap\.xml/.test(robots) && !/Disallow: \/\s*$/m.test(robots), 'robots.txt allows crawling and names the sitemap');
ok(!/noindex|__dev|dist-|preview/.test(sitemap), 'sitemap has no noindex/preview/dev URLs');
ok(!existsSync(join(dist, '__dev')), 'no __dev folder in production');
// language purity: Spanish pages carry no English page chrome and vice-versa (spot check on UI strings)
for (const u of locs) { const h = pages[u] || '', isEn = u.startsWith('/en/') || u === '/en/'; const body = h.slice(h.indexOf('<main')); ok(isEn ? !/Saltar al contenido|Preguntas frecuentes<\/h2>|Aviso legal<\/a>/.test(h.slice(0, h.indexOf('<main'))) : !/Skip to content/.test(h), `${u}: no mixed-language page chrome`); void body; }
// single public phone number: no trace of the former number anywhere in the package (HTML, structured data, JS config, PDFs, XML, JSON)
{ const all = []; (function w(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? w(f) : all.push(f); } })(dist);
  let oldHits = 0, textFiles = 0, telLinks = new Set();
  for (const f of all) { if (/\.(webp|avif|jpe?g|png|woff2?|webm|ico)$/i.test(f)) continue; const s = readFileSync(f).toString('latin1'); textFiles++;
    if (/865[s .-]?699[s .-]?969|34865699969/.test(s)) { oldHits++; ok(false, 'former phone number +34 865 699 969 found in ' + relative(dist, f)); }
    for (const m of s.matchAll(/href="(tel:[^"]+)"/g)) telLinks.add(m[1]); }
  ok(oldHits === 0, 'the former number appears nowhere in the package (' + textFiles + ' text/PDF files scanned)');
  ok([...telLinks].join() === 'tel:+34605259206', 'every tel: link in the package is tel:+34605259206 (' + [...telLinks] + ')');
  // normal WhatsApp buttons carry no pre-filled text (only the calculator and the online detection report build a message, in JS)
  let pre = 0; for (const u of Object.keys(pages)) for (const m of pages[u].matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)) if (m[1] !== 'https://wa.me/34605259206') { pre++; ok(false, u + ': WhatsApp link not plain: ' + m[1]); }
  ok(pre === 0, 'every static WhatsApp link is exactly https://wa.me/34605259206'); }
console.log(`checked ${locs.length} sitemap URLs; ${warns.length} warning(s)`); if (warns.length) console.log(warns.slice(0, 40).map(w => '  warn  ' + w).join('\n'));
console.log(failures.length ? `\n${failures.length} FAILED` : '\nSEO AUDIT: ALL PASSED');
process.exit(failures.length ? 1 : 0);
