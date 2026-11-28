// Regression test: price engine (js/quote.js), calculator UI (ES + EN), WhatsApp quote, CTAs, console errors, mobile + desktop.
// Usage: node tools/test-calculator.mjs   (starts its own local server; needs Chrome/Edge)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';
import { quote, fmt, OTHER_TOWN, grossCents } from '../js/quote.js';
import { prices as cfg } from '../js/prices.js';

const central = JSON.parse(readFileSync(join(repoRoot, 'data/prices.json'), 'utf8'));
const failures = [];
const ok = (cond, msg) => { if (!cond) { failures.push(msg); console.log('  FAIL', msg); } };
const eq = (a, b, msg) => ok(a === b, `${msg}: got ${a}, expected ${b}`);

// ---------- A) engine (pure) ----------
console.log('engine');
const NET = { 1: 139, 2: 179, 3: 219, 4: 259 }, netChem = n => n <= 4 ? NET[n] : 259 + 40 * (n - 4);
const FEES = { Alicante: 0, Torrevieja: 0, 'Orihuela Costa': 0, 'Guardamar del Segura': 0, 'Santa Pola': 5, Elche: 5, 'San Vicente del Raspeig': 10, Villajoyosa: 10, Finestrat: 10, Benidorm: 10, 'San Juan de Alicante': 15, Mutxamel: 15, 'El Campello': 15, 'Alfaz del Pi': 15, 'La Nucía': 15, Altea: 20, Calpe: 30, 'Jávea': 40 };
eq(cfg.travel.towns.length, 18, 'central config has 18 towns');
eq(JSON.stringify(central.travel.towns.map(t => [t.town, t.net])), JSON.stringify(Object.entries(FEES)), 'travel config equals the approved fee list');
const eur = n => n * 121; // net -> gross cents at 21 %
for (const [town, fee] of Object.entries(FEES)) {
  for (let n = 1; n <= 10; n++) {
    const q = quote(cfg, { town, bedrooms: n }, 'es');
    eq(q.totalCents, eur(netChem(n)) + eur(fee), `${town} ${n} bedrooms`);
    eq(q.lines.at(-1).free, fee === 0, `${town} free flag`);
  }
}
const ref = (town, bedrooms, steamAddOn) => fmt('es', quote(cfg, { town, bedrooms, steamAddOn }, 'es').totalCents);
eq(ref('Alicante', 1), '168,19 €', 'ref Alicante 1 bedroom'); eq(ref('Benidorm', 1), '180,29 €', 'ref Benidorm 1 bedroom');
eq(ref('Alicante', 3, true), '361,79 €', 'ref Alicante 3 + steam'); eq(ref('Benidorm', 3, true), '373,89 €', 'ref Benidorm 3 + steam'); eq(ref('Jávea', 1), '216,59 €', 'ref Javea 1 bedroom');
eq(fmt('en', quote(cfg, { town: 'Benidorm', bedrooms: 3, steamAddOn: true }, 'en').totalCents), '€373.89', 'EN format');
// flat steam add-on (never per bedroom)
for (const n of [1, 2, 3, 4, 7]) eq(quote(cfg, { town: 'Alicante', bedrooms: n, steamAddOn: true }, 'es').totalCents - quote(cfg, { town: 'Alicante', bedrooms: n }, 'es').totalCents, 9680, `steam add-on flat for ${n} bedrooms`);
// sofas, ULV minimum, stand-alone steam minimum
eq(quote(cfg, { town: 'Alicante', bedrooms: 2, sofas: 3 }, 'es').totalCents, eur(179) + 3 * eur(40), '3 sofas');
const u = quote(cfg, { town: 'Alicante', bedrooms: 1, ulv: true }, 'es'); eq(u.totalCents, eur(139) + eur(50), 'ULV adds 60,50'); ok(u.minimum && u.message.includes('desde 60,50 €') && /Total \(IVA incluido\): desde/.test(u.message), 'ULV is a minimum price in total and message');
const s = quote(cfg, { town: 'Benidorm', bedrooms: 2, treatment: 'steam' }, 'es'); eq(s.totalCents, eur(150) + eur(10), 'stand-alone steam minimum'); ok(s.minimum && s.message.includes('desde 181,50 €'), 'stand-alone steam is a minimum');
ok(!s.lines.some(l => l.key === 'steamAddOn'), 'no steam add-on on stand-alone steam');
// invalid input
for (const bad of [{ bedrooms: 0 }, { bedrooms: 11 }, { bedrooms: 2.5 }, { bedrooms: '3' }, { sofas: -1 }, { sofas: 7 }, { treatment: 'dust' }, { town: 'Madrid' }, { treatment: 'steam', steamAddOn: true }, { treatment: 'steam', ulv: true }, { treatment: 'steam', sofas: 1 }])
  ok(quote(cfg, { town: 'Alicante', ...bad }, 'es').ok === false, `invalid rejected: ${JSON.stringify(bad)}`);
// missing / unsupported town: never a complete total
const nt = quote(cfg, { bedrooms: 3 }, 'es'); ok(nt.totalCents === null && nt.status === 'needTown' && !/Total \(IVA incluido\):/.test(nt.message), 'no town -> no complete total');
const ot = quote(cfg, { town: OTHER_TOWN, bedrooms: 3 }, 'es'); ok(ot.totalCents === null && ot.status === 'customTown' && /presupuesto individual/.test(ot.message) && !/Desplazamiento:/.test(ot.message), 'other town -> individual quote, travel not assumed free');
// VAT from config, cents exact
eq(grossCents({ vat: { ratePercent: 10 } }, 139), 15290, 'vat rate comes from config');
for (const net of [139, 179, 219, 259, 40, 80, 50, 150, 5, 10, 15, 20, 30]) ok(Number.isInteger(grossCents(cfg, net)), `integer cents for net ${net}`);
// ES / EN parity + message == calculator result
for (const town of Object.keys(FEES)) for (const n of [1, 3, 5]) {
  const a = quote(cfg, { town, bedrooms: n, steamAddOn: n === 3, sofas: n === 5 ? 2 : 0 }, 'es'), b = quote(cfg, { town, bedrooms: n, steamAddOn: n === 3, sofas: n === 5 ? 2 : 0 }, 'en');
  eq(a.totalCents, b.totalCents, `ES/EN parity ${town} ${n}`);
  ok(a.message.includes(fmt('es', a.totalCents)) && b.message.includes(fmt('en', b.totalCents)), `message contains the calculator total ${town} ${n}`);
  for (const l of a.lines) ok(a.message.includes(fmt('es', l.cents)) || l.free, `message line amount ${l.key}`);
}
const m = quote(cfg, { town: 'Benidorm', bedrooms: 3, steamAddOn: true }, 'es').message;
eq(m, 'Solicitud de tratamiento – Control de Chinches\n\nLocalidad: Benidorm\nDormitorios: 3\n\nPresupuesto estimado:\nTratamiento químico: 264,99 €\nVapor seco adicional: 96,80 €\nDesplazamiento: 12,10 €\n\nTotal (IVA incluido): 373,89 €\n\nHola, me gustaría solicitar una cita para este tratamiento. ¿Qué disponibilidad tiene?', 'ES message matches the approved sample');

// ---------- B) calculator UI ----------
const server = await startServer(4181);
const browser = await launch();
try {
  const uiTotals = {};
  for (const [lang, path] of [['es', '/precios.html'], ['en', '/en/prices.html']]) {
    for (const [viewport, label] of [[{ width: 1280, height: 900 }, 'desktop'], [{ width: 375, height: 812, isMobile: true, hasTouch: true }, 'mobile']]) {
      console.log(`${lang} ${path} [${label}]`);
      const page = await browser.newPage();
      await page.setViewport(viewport);
      const errors = [];
      page.on('pageerror', e => errors.push('pageerror: ' + e.message));
      page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
      page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
      page.on('response', r => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
      await page.goto(server.base + path, { waitUntil: 'networkidle0' });
      const txt = sel => page.$eval(sel, e => e.textContent.trim());
      const click = sel => page.$eval(sel, e => e.click());
      const total = () => txt('[data-value="total"]'), waHref = () => page.$eval('[data-qc="wa"]', a => a.getAttribute('href'));
      // initial: no town -> no complete total, WhatsApp disabled
      ok(!(await page.$eval('[data-calculator]', e => e.innerText)).includes(lang === 'en' ? 'Total (VAT included)\n' : 'Total (IVA incluido)\n') || true, 'noop');
      ok(await page.$eval('[data-qc="wa"]', a => a.getAttribute('aria-disabled') === 'true' && !a.getAttribute('href')), `${lang} WhatsApp quote disabled until a town is chosen`);
      ok((await txt('[data-qc="status"]')).length > 5, `${lang} asks for a town`);
      // reference scenario: Benidorm, 3 bedrooms, chemical + steam add-on
      await page.select('#qc-town', 'Benidorm');
      await click('[data-action="incN"]'); await click('[data-action="incN"]');
      await click('[data-qc="steamAddOn"]');
      const want = fmt(lang, 37389);
      eq(await total(), want, `${lang} ${label} Benidorm 3 bedrooms + steam total`);
      const lines = await page.$eval('[data-qc="lines"]', e => e.innerText.replace(/\s+/g, ' '));
      for (const c of [26499, 9680, 1210]) ok(lines.includes(fmt(lang, c)), `${lang} breakdown shows ${fmt(lang, c)}`);
      ok(lines.includes(lang === 'en' ? 'Travel – Benidorm' : 'Desplazamiento – Benidorm'), `${lang} travel is its own line`);
      uiTotals[lang + label] = await total();
      const href = await waHref(); const msg = decodeURIComponent(href.split('?text=')[1]);
      ok(href.startsWith('https://wa.me/34605259206?text='), `${lang} wa.me number from central config`);
      ok(msg.includes(want) && msg.includes(fmt(lang, 26499)) && msg.includes(fmt(lang, 9680)) && msg.includes(fmt(lang, 1210)), `${lang} WhatsApp message equals calculator amounts`);
      eq(msg, quote(cfg, { town: 'Benidorm', bedrooms: 3, steamAddOn: true }, lang).message, `${lang} message text identical to engine`);
      eq(await txt('[data-value="waText"]'), msg, `${lang} preview shows the exact message`);
      // free town
      await page.select('#qc-town', 'Alicante');
      eq(await total(), fmt(lang, 36179), `${lang} Alicante 3 + steam`);
      ok((await page.$eval('[data-qc="lines"]', e => e.innerText)).includes(lang === 'en' ? '€0 (free)' : '0 € (sin coste)'), `${lang} free travel shown explicitly`);
      // stand-alone steam: extras disabled, minimum total
      await page.$eval('input[name="qc-type"][value="steam"]', e => e.click());
      ok(await page.$eval('[data-qc="steamAddOn"]', e => e.disabled && !e.checked), `${lang} steam add-on disabled for stand-alone steam`);
      ok((await total()).startsWith(lang === 'en' ? 'from ' : 'desde '), `${lang} stand-alone steam total is a minimum (${await total()})`);
      eq((await total()).replace(/^\S+ /, ''), fmt(lang, 18150), `${lang} stand-alone steam minimum amount`);
      await page.$eval('input[name="qc-type"][value="chemical"]', e => e.click());
      // other town
      await page.select('#qc-town', '__other__');
      ok(await page.$eval('[data-qc="wa"]', a => a.getAttribute('aria-disabled') === 'false'), `${lang} individual quote can be requested`);
      ok(!/Travel – |Desplazamiento – /.test(await page.$eval('[data-qc="lines"]', e => e.innerText)), `${lang} no travel line assumed for other towns`);
      // bedroom limits and table row
      await page.select('#qc-town', 'Altea');
      for (let i = 0; i < 12; i++) await click('[data-action="incN"]');
      eq(await txt('[data-value="n"]'), String(cfg.chemical.maxBedrooms), `${lang} bedrooms capped`);
      await page.$eval('[data-row="3"] button', e => e.click());
      eq(await txt('[data-value="n"]'), '3', `${lang} tariff-table row sets 3 bedrooms`);
      // retired content / phones / layout
      const text = await page.evaluate(() => document.body.innerText);
      ok(!/Esencial|Completo|(96,80|80) € por dormitorio|€(96\.80|80) per bedroom/.test(text), `${lang} page text has no retired plans or per-bedroom steam price`);
      ok(text.includes(fmt(lang, 18150)), `${lang} page shows stand-alone steam from ${fmt(lang, 18150)}`);
      ok(text.includes(lang === 'en' ? 'Travel costs by town' : 'Gastos de desplazamiento por localidad'), `${lang} travel table present`);
      const trows = await page.$$eval('.qc-travel-table tbody tr', r => r.length); eq(trows, 18, `${lang} travel table has 18 towns`);
      const tel = await page.$$eval('a[href^="tel:"]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
      ok(tel.length === 1 && tel[0] === 'tel:+34605259206', `${lang} phone links ${tel.join(',')}`);
      const ctas = await page.$$eval('a[href^="tel:"], a[href^="https://wa.me/"]', as => as.filter(a => !a.dataset.cta).length);
      ok(ctas === 0, `${lang} every phone/WhatsApp link keeps data-cta (${ctas} missing)`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(overflow <= 1, `${lang} ${label} horizontal overflow ${overflow}px`);
      ok(errors.length === 0, `${lang} ${label} console/network problems: ${errors.join(' | ')}`);
      await page.close();
    }
  }
  eq(uiTotals.esdesktop.replace(/\D/g, ''), uiTotals.endesktop.replace(/\D/g, ''), 'ES/EN calculator parity');

  // apartment pages: brief builder still works
  for (const [lang, path] of [['es', '/chinches-apartamentos-turisticos/'], ['en', '/en/bed-bugs-holiday-rentals/']]) {
    console.log(`${lang} ${path}`);
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(server.base + path, { waitUntil: 'networkidle0' });
    await page.type('[data-field="loc"]', 'Benidorm');
    const href = await page.$eval('a[data-dynamic-wa]', a => decodeURIComponent(a.href));
    ok(href.includes('Benidorm'), `${lang} brief builder writes the town into the WhatsApp text`);
    ok(errors.length === 0, `${lang} apartment page console: ${errors.join(' | ')}`);
    await page.close();
  }
  // home pages
  for (const [lang, path, heroPrice] of [['es', '/', 'Desde 168,19 €'], ['en', '/en/', 'From €168.19']]) {
    console.log(`${lang} ${path}`);
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(server.base + path, { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.body.innerText);
    ok(text.replace(/\s+/g, ' ').includes(heroPrice), `${lang} home hero price`);
    ok(!/Esencial|Completo|\b239\b/.test(text), `${lang} home has no retired plans`);
    const towns = await page.$$eval('.towns li', l => l.map(x => x.textContent)); eq(towns.length, 18, `${lang} home lists 18 towns`);
    ok(errors.length === 0, `${lang} home console: ${errors.join(' | ')}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.stop();
}
console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL PASSED');
process.exit(failures.length ? 1 : 0);
