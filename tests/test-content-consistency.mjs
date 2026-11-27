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
// ---- images: a PRODUCTION render keeps only P0/P1 placeholders (optional visuals are left out); every placed photo is ready or a placeholder
{ const pc = makeContext({ mode: 'production', pageDirs: ['data/pages'], simulatePublished: new Set(Object.keys(pages)) }); let left = 0, shown = 0;
  for (const p of Object.values(pages)) for (const lang of ['es', 'en']) {
    const html = renderPage({ ...pc, page: p, lang, ui: ui[lang] });
    for (const m of html.matchAll(/data-image-id="([^"]+)"/g)) { left++; ok(/^P[01]/.test(pc.images[m[1]]?.priority || ''), `${p.id} ${lang}: optional placeholder ${m[1]} must not appear in a production render`); }
    shown += (html.match(/<picture>/g) || []).length; }
  ok(shown > 0 && left > 0, `production render still shows ready pictures (${shown}) and only required placeholders (${left})`); }
// a hand-typed euro amount in page data would bypass the central price source
for (const p of Object.values(pages)) { const raw = JSON.stringify([p.es, p.en]); const m = raw.match(/\d[\d.,]*\s?€|€\s?\d/g); ok(!m, `${p.id}: hand-typed price in page data (${m}) - use {{price:KEY}} tokens`); }
console.log(failed ? `\n${failed} FAILED` : `\nCONTENT CONSISTENCY: all checks passed (${Object.keys(pages).length} pages x 2 languages)`);
process.exit(failed ? 1 : 0);
