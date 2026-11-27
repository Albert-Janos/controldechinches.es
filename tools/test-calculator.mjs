// Regression test: price calculator (ES + EN), WhatsApp/phone CTAs, console errors, mobile + desktop.
// Usage: node tools/test-calculator.mjs   (starts its own local server; needs Chrome/Edge)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';

const prices = JSON.parse(readFileSync(join(repoRoot, 'data/prices.json'), 'utf8'));
const base = prices.chemical.bedroomPrices;
const expectedBase = n => n <= 4 ? base[n - 1] : base[3] + (n - 4) * prices.chemical.additionalBedroom;
const steam = prices.addons.steamPerBedroom.amount, sofa = prices.addons.sofaEach.amount, ulv = prices.addons.ulvFrom.amount;
const money = (lang, n) => lang === 'en' ? '€' + n : n + ' €';

const failures = [];
const ok = (cond, msg) => { if (!cond) { failures.push(msg); console.log('  FAIL', msg); } };

const server = await startServer(4181);
const browser = await launch();
try {
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
      const total = () => page.$eval('[data-value="total"]', e => e.textContent.trim());
      const click = sel => page.$eval(sel, e => e.click());
      const waHref = () => page.$eval('a[data-dynamic-wa]', a => decodeURIComponent(a.href));

      // initial state: update() must have run (WhatsApp link pre-filled)
      let wa = await waHref();
      ok(wa.includes(lang === 'en' ? 'Hello' : 'Hola'), `${lang} initial WhatsApp message is pre-filled`);
      ok(await total() === money(lang, base[0]), `${lang} initial total ${await total()}`);

      // rooms 1..10
      for (let n = 1; n <= 10; n++) {
        if (n > 1) await click('[data-action="incN"]');
        ok(await total() === money(lang, expectedBase(n)), `${lang} rooms=${n} total=${await total()} expected ${expectedBase(n)}`);
      }
      // upper limit: 10 -> stays 10
      await click('[data-action="incN"]');
      ok(await total() === money(lang, expectedBase(10)), `${lang} rooms capped at 10`);
      for (let n = 10; n > 2; n--) await click('[data-action="decN"]');
      // now rooms = 2 : toggles
      await click('[data-action="toggleVapor"]');
      ok(await total() === money(lang, expectedBase(2) + steam * 2), `${lang} +steam for 2 bedrooms -> ${await total()}`);
      await click('[data-action="decV"]');
      ok(await total() === money(lang, expectedBase(2) + steam), `${lang} steam for 1 bedroom -> ${await total()}`);
      await click('[data-action="incS"]'); await click('[data-action="incS"]');
      ok(await total() === money(lang, expectedBase(2) + steam + sofa * 2), `${lang} +2 sofas -> ${await total()}`);
      await click('[data-action="toggleUlv"]');
      ok(await total() === money(lang, expectedBase(2) + steam + sofa * 2 + ulv), `${lang} +ULV -> ${await total()}`);
      const prefix = await page.$eval('[data-value="totalPrefix"]', e => e.textContent.trim());
      ok(/Total desde|Total from/.test(prefix), `${lang} ULV makes total a "from" amount (${prefix})`);
      wa = await waHref();
      ok(!/Esencial|Completo/i.test(wa), `${lang} WhatsApp message has no retired plan names`);
      ok(wa.includes(lang === 'en' ? 'Chemical treatment' : 'Tratamiento químico'), `${lang} WhatsApp message names the treatment`);
      ok(/wa\.me\/34605259206/.test(wa), `${lang} WhatsApp number`);
      // no retired content in the DOM
      const text = await page.evaluate(() => document.body.innerText);
      ok(!/Esencial|Completo|\b239\b|\b289\b|\b339\b|\b399\b/.test(text), `${lang} page text has no retired plans/prices`);
      ok(text.includes(lang === 'en' ? '€150' : '150 €'), `${lang} page shows dry steam from 150`);
      // table row click loads the room count
      await page.$eval('[data-action="row-3"]', e => e.click());
      ok(await page.$eval('[data-value="n"]', e => e.textContent.trim()) === '3', `${lang} table row click sets 3 bedrooms`);
      // phone CTAs
      const tel = await page.$$eval('a[href^="tel:"]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
      ok(tel.length === 1 && tel[0] === 'tel:+34605259206', `${lang} phone links ${tel.join(',')}`);
      const ctas = await page.$$eval('a[href^="tel:"], a[href^="https://wa.me/"]', as => as.filter(a => !a.dataset.cta).length);
      ok(ctas === 0, `${lang} every phone/WhatsApp link keeps data-cta (${ctas} missing)`);
      // layout: no horizontal overflow
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(overflow <= 1, `${lang} ${label} horizontal overflow ${overflow}px`);
      ok(errors.length === 0, `${lang} ${label} console/network problems: ${errors.join(' | ')}`);
      await page.close();
    }
  }

  // apartment pages: brief builder still works, no console errors, WhatsApp link updates
  for (const [lang, path] of [['es', '/chinches-apartamentos-turisticos/'], ['en', '/en/bed-bugs-holiday-rentals/']]) {
    console.log(`${lang} ${path}`);
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(server.base + path, { waitUntil: 'networkidle0' });
    await page.type('[data-field="loc"]', 'Benidorm');
    const href = await page.$eval('a[data-dynamic-wa]', a => decodeURIComponent(a.href));
    ok(href.includes('Benidorm'), `${lang} brief builder writes the town into the WhatsApp text`);
    ok(errors.length === 0, `${lang} apartment page console: ${errors.join(' | ')}`);
    await page.close();
  }

  // home pages: no console errors, hero price + plan cards
  for (const [lang, path, heroPrice] of [['es', '/', 'Desde 139 €'], ['en', '/en/', 'From €139']]) {
    console.log(`${lang} ${path}`);
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(server.base + path, { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.body.innerText);
    ok(text.replace(/\s+/g, ' ').includes(heroPrice), `${lang} home hero price`);
    ok(!/Esencial|Completo|\b239\b/.test(text), `${lang} home has no retired plans`);
    ok(errors.length === 0, `${lang} home console: ${errors.join(' | ')}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.stop();
}
console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL PASSED');
process.exit(failures.length ? 1 : 0);
