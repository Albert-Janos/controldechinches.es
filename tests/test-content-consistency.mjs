// Content/data consistency (no browser): contact numbers, service area, prices (net -> consumer), ES/EN pair parity, draft status.
// Usage: node tests/test-content-consistency.mjs
import { readFileSync } from 'node:fs';
import { makeContext } from '../tools/build.mjs';
import { renderPage } from '../templates/templates.mjs';
import { ui } from '../templates/ui.mjs';
import { consumerPrice, netPrices } from '../templates/prices.mjs';

let failed = 0; const ok = (c, m) => { if (!c) { failed++; console.log('  FAIL', m); } };
const ctx0 = makeContext({ mode: 'preview', pageDirs: ['data/pages'] }), { site, prices, pages } = ctx0;

// ---- contact data: two different numbers with two different roles
ok(site.dispatcher.tel === '+34865699969' && site.whatsapp.number === '34605259206' && site.whatsapp.url === 'https://wa.me/34605259206', 'approved dispatcher / WhatsApp numbers in data/site.json');
ok(site.dispatcher.tel !== '+' + site.whatsapp.number, 'dispatcher and WhatsApp numbers are different fields');
// ---- service area: 18 approved towns, no Dénia, featured list is a subset
const A = site.serviceAreas;
ok(A.confirmed.length === 18 && new Set(A.confirmed).size === 18, '18 distinct approved towns');
ok(!A.confirmed.some(t => /D[eé]nia/.test(t)), 'Dénia is not in the approved list');
ok(A.featured.every(t => A.confirmed.includes(t)), 'featured towns are all approved towns');
ok(Object.keys(A.cityPages).every(t => A.confirmed.includes(t)), 'city pages only for approved towns');
ok(site.person.showRegistrationNumber === false, 'registration number stays hidden');
// ---- prices: net values exactly as approved, consumer values derived centrally
const n = netPrices(prices);
ok(JSON.stringify([n.chem1, n.chem2, n.chem3, n.chem4, n.chemExtra, n.steam, n.steamAddOn, n.sofa, n.fogging]) === JSON.stringify([139, 179, 219, 259, 40, 150, 80, 40, 50]), 'approved net prices unchanged');
ok(consumerPrice(prices, 'es', 139) === '168,19 €' && consumerPrice(prices, 'en', 139) === '€168.19' && consumerPrice(prices, 'es', 150) === '181,50 €', 'consumer price = net x 1.21 (ES/EN formatting)');
ok(prices.vat.status === 'planning-assumption', 'VAT stays a planning assumption (LGL gate open)');

// ---- production gate: a page showing a price is refused while the VAT decision is not final
{ const { build } = await import('../tools/build.mjs'); let refused = '';
  try { build({ mode: 'production', out: 'dist-vat-test', simulatePublished: new Set(['PG-014']) }); } catch (e) { refused = e.message; }
  ok(/vat\.status/.test(refused), 'production build refuses a price-showing page while VAT is a planning assumption');
  const { rmSync } = await import('node:fs'); rmSync(new URL('../dist-vat-test', import.meta.url), { recursive: true, force: true }); }
// ---- every generated page
const stat = {};
for (const p of Object.values(pages)) {
  ok(p.status === 'Draft', `${p.id} must stay Draft (is ${p.status})`);
  for (const lang of ['es', 'en']) {
    const html = renderPage({ ...ctx0, page: p, lang, ui: ui[lang] });
    ok(/<meta name="robots" content="noindex, nofollow">/.test(html), `${p.id} ${lang}: noindex`);
    const tels = [...html.matchAll(/href="tel:([^"]+)"/g)].map(m => m[1]), was = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)].map(m => m[1]);
    ok(tels.length > 0 && tels.every(t => t === site.dispatcher.tel), `${p.id} ${lang}: every tel: link is the dispatcher number`);
    ok(was.length > 0 && was.every(w => w === site.whatsapp.url), `${p.id} ${lang}: every WhatsApp link is wa.me/34605259206 without text`);
    ok(!/tel:\+?34605259206/.test(html), `${p.id} ${lang}: WhatsApp number never used as phone CTA`);
    ok(!/\{\{/.test(html), `${p.id} ${lang}: no unresolved tokens`);
    ok(html.includes(A.featured[0]) && /y otras localidades|and other towns/.test(html), `${p.id} ${lang}: footer shows featured towns and says there are more`);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const org = ld['@graph'].find(x => x['@type'] === 'Organization');
    ok(org.telephone === site.dispatcher.tel, `${p.id} ${lang}: Organization telephone is the dispatcher`);
    const svc = ld['@graph'].find(x => x['@type'] === 'Service');
    if (svc) { const want = p.areaServed || A.confirmed; ok(JSON.stringify(svc.areaServed.map(a => a.name)) === JSON.stringify(want), `${p.id} ${lang}: Service.areaServed matches the central area data`); }
    if (svc?.offers) ok(svc.offers.every(o => o.priceSpecification.valueAddedTaxIncluded === true), `${p.id} ${lang}: offers declare VAT included`);
    stat[p.id + lang] = html;
  }
  // ---- ES/EN pair parity (structure, not wording)
  const E = p.es, N = p.en, sig = L => (L.blocks || []).map(b => b.type + (b.items ? ':' + b.items.length : '') + (b.image ? ':' + b.image : '') + (b.id && /^IG-/.test(b.id) ? ':' + b.id : '')).join('|');
  ok(sig(E) === sig(N), `${p.id}: ES/EN block structure differs\n     ES ${sig(E)}\n     EN ${sig(N)}`);
  ok((E.faq || []).length === (N.faq || []).length, `${p.id}: FAQ count differs`);
  ok((E.sources || []).length === (N.sources || []).length, `${p.id}: sources count differs`);
  ok(E.heroImage === N.heroImage, `${p.id}: hero image differs`);
  const links = L => [...JSON.stringify(L).matchAll(/href=\\"([^\\"]+)\\"/g)].length;
  ok(links(E) === links(N), `${p.id}: number of inline links differs (ES ${links(E)} / EN ${links(N)})`);
}
// ---- images + video: no placeholder / empty image slot anywhere (preview AND production); every <img> has real dimensions; the video is click-to-load
for (const mode of ['preview', 'production']) {
  const pc = makeContext({ mode, pageDirs: ['data/pages'], simulatePublished: mode === 'production' ? new Set(Object.keys(pages)) : undefined }); let pics = 0, vids = 0;
  for (const p of Object.values(pages)) for (const lang of ['es', 'en']) {
    const html = renderPage({ ...pc, page: p, lang, ui: ui[lang] }), tag = `${p.id} ${lang} (${mode})`;
    ok(!/class="sx-ph|data-image-id=/.test(html), `${tag}: empty image placeholder rendered`);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) ok(/\swidth="\d+"/.test(m[0]) && /\sheight="\d+"/.test(m[0]) && /\salt="/.test(m[0]), `${tag}: <img> without width/height/alt`);
    pics += (html.match(/<picture>/g) || []).length;
    if (html.includes('data-video=')) { vids++; ok(!/<video\b|<source[^>]+type="video\//.test(html) && !/autoplay/i.test(html), `${tag}: video must be click-to-load (no <video>, no autoplay in the initial HTML)`); }
  }
  ok(pics > 0, `${mode}: ready pictures are rendered (${pics})`); ok(vids === 2, `${mode}: the video appears on both language versions of the dry steam page (${vids})`);
}
{ const { statSync, existsSync } = await import('node:fs'); const v = Object.values(ctx0.videos)[0]; ok(v && existsSync(new URL(`../assets/video/${v.name}.webm`, import.meta.url)) && statSync(new URL(`../assets/video/${v.name}.webm`, import.meta.url)).size < 200 * 1024 && v.audio === false, 'web video exists, is < 200 KB and has no audio track'); }
// ---- atlas PG-070: the COMPLETE planned structure is rendered (all categories, filter chips, expert text); missing photos are registered, never shown
{ const at = pages['PG-070'], g = at.es.blocks.find(b => b.type === 'gallery'), planned = g.groups.flatMap(x => x.images);
  ok(g.groups.length === 8 && g.filters.length === 8 && at.en.blocks.find(b => b.type === 'gallery').groups.length === 8, 'atlas keeps its 8 categories and 8 filter chips (ES + EN)');
  ok(new Set(planned).size === 29 && planned.every(i => ctx0.images[i]), `atlas registers 29 planned photo slots, all known to the image manifest (${planned.length})`);
  ok(['IMG-ENT-ADU-02', 'IMG-ENT-ADU-03', 'IMG-ENT-NYM-01', 'IMG-ENT-NYM-05', 'IMG-ENT-EGG-03', 'IMG-ENT-SCALE-02', 'IMG-SEV-01'].every(i => planned.includes(i)), 'atlas still plans males, unfed adults, nymph stages 1-5, hatched egg shells, scale and severity images');
  ok(planned.filter(i => ctx0.images[i].status === 'ready').length === 7, 'atlas currently contains 7 ready images');
  for (const mode of ['preview', 'production']) for (const lang of ['es', 'en']) {
    const pc = makeContext({ mode, pageDirs: ['data/pages'], simulatePublished: mode === 'production' ? new Set(Object.keys(pages)) : undefined });
    const html = renderPage({ ...pc, page: at, lang, ui: ui[lang] }), tag = `PG-070 ${lang} (${mode})`;
    ok((html.match(/<h3 id="/g) || []).length === 8 && (html.match(/sx-group-intro"/g) || []).length === 8, `${tag}: all 8 category headings with their text are rendered`);
    ok(((html.match(/class="sx-filters">([\s\S]*?)<\/ul>/) || [])[1] || '').split('<a ').length - 1 === 8, `${tag}: 8 filter chips`);
    ok(!/sx-ph|data-image-id/.test(html), `${tag}: no empty image slot`);
  } }
// a hand-typed euro amount in page data would bypass the central price source
for (const p of Object.values(pages)) { const raw = JSON.stringify([p.es, p.en]); const m = raw.match(/\d[\d.,]*\s?€|€\s?\d/g); ok(!m, `${p.id}: hand-typed price in page data (${m}) - use {{price:KEY}} tokens`); }
console.log(failed ? `\n${failed} FAILED` : `\nCONTENT CONSISTENCY: all checks passed (${Object.keys(pages).length} pages x 2 languages)`);
process.exit(failed ? 1 : 0);
