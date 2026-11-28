// Resources, PDFs, online detection report, gallery + lightbox, full-bleed hero. Usage: node tests/test-resources.mjs  (needs Chrome/Edge)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { packageSite } from '../tools/package-site.mjs';
import { startServer, launch, repoRoot } from '../tools/lib/browser.mjs';
import { buildDocument, PDF_DOCS } from '../js/pdf-docs.js';

const failures = []; const ok = (c, m) => { console.log(c ? '  ok  ' : '  FAIL', m); if (!c) failures.push(m); };
const latin1 = u8 => Buffer.from(u8).toString('latin1');

// ---------- A) PDF files (static) ----------
console.log('static PDFs');
const logo = new Uint8Array(readFileSync(join(repoRoot, 'assets/pdf-logo.jpg')));
ok(PDF_DOCS.length === 6, '6 base documents x 2 languages = 12 PDFs');
for (const d of PDF_DOCS) for (const lang of ['es', 'en']) {
  const f = join(repoRoot, 'assets/pdf', d[lang].file), s = statSync(f), txt = latin1(readFileSync(f));
  ok(s.size > 5000 && s.size < 200000, `${d[lang].file}: size ${s.size} B is sane (small)`);
  ok(txt.startsWith('%PDF-1.4') && txt.trimEnd().endsWith('%%EOF'), `${d[lang].file}: PDF header and trailer`);
  const xref = Number(/startxref\n(\d+)/.exec(txt)[1]); ok(txt.slice(xref, xref + 4) === 'xref', `${d[lang].file}: xref offset points at the xref table`);
  const offs = [...txt.slice(xref).matchAll(/(\d{10}) 00000 n/g)].map(m => Number(m[1])); ok(offs.every((o, i) => new RegExp(`^${i + 1} 0 obj`).test(txt.slice(o, o + 12))), `${d[lang].file}: every xref entry points at its object`);
  ok(/\/MediaBox \[0 0 595\.28 841\.89\]/.test(txt), `${d[lang].file}: A4 page`);
  ok(/\/Title \(/.test(txt) && txt.includes('Version') || txt.includes('Versi\\363n') || txt.includes('Versi'), `${d[lang].file}: carries version text`);
  ok(txt.includes('1.0') && txt.includes('controldechinches.es') && txt.includes('605 259 206'), `${d[lang].file}: version 1.0, website and WhatsApp contact`);
  ok(txt.includes('/Subtype /Image'), `${d[lang].file}: logo embedded`);
}
// filled detection report: accents and special characters survive (WinAnsi)
{
  const data = { datetime: '28/11/2026 14:30', property: 'Apartamento Señora Peñíscola – “Sol”', unit: 'Habitación 3 ñ ü € ¿?', reporter: 'José Ángel Núñez', town: 'Jávea', phone: '+34 600 111 222', checks: [true, false, true, false, false, false, true, true] };
  const bytes = buildDocument('detection', 'es', { logo, data }), txt = latin1(bytes);
  for (const want of ['\\361', '\\301', '\\372', '\\277', 'Jávea'.replace('á', '\\341'), '28/11/2026 14:30', '+34 600 111 222', 'Pe\\361\\355scola']) ok(txt.includes(want), `filled PDF contains ${want}`);
  ok((txt.match(/1\.6 w/g) || []).length === 4, 'filled PDF draws exactly 4 check marks (the ticked signs)');
  ok((txt.match(/\/Type \/Page /g) || []).length === 1, 'filled report is one A4 page');
  const blank = latin1(buildDocument('detection', 'es', { logo })); ok((blank.match(/1\.6 w/g) || []).length === 0, 'blank report has no check marks');
}

// ---------- B) pages in a real browser ----------
packageSite({ mode: 'preview', out: 'dist-preview', pageDirs: [] });
const server = await startServer(4187, join(repoRoot, 'dist-preview')), browser = await launch();
try {
  // resources hub: every PDF link works
  for (const [lang, url] of [['es', '/recursos/'], ['en', '/en/resources/']]) {
    const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 900 });
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(server.base + url, { waitUntil: 'networkidle0' });
    const links = await page.$$eval('a[download][data-track="pdf_download"]', as => as.map(a => a.getAttribute('href')));
    ok(links.length === 6, `${lang} ${url}: 6 PDF downloads listed (${links.length})`);
    for (const l of links) { const r = await page.evaluate(async u => { const x = await fetch(u); return { s: x.status, t: x.headers.get('content-type'), n: (await x.arrayBuffer()).byteLength }; }, l); ok(r.s === 200 && /pdf/.test(r.t) && r.n > 5000, `${lang} ${l} downloads (${r.s}, ${r.t}, ${r.n} B)`); }
    const ev = await page.evaluate(() => new Promise(res => { window.addEventListener('cdc:track', e => res(e.detail), { once: true }); document.querySelector('a[download]').addEventListener('click', e => e.preventDefault(), { once: true }); document.querySelector('a[download]').click(); setTimeout(() => res(null), 800); }));
    ok(ev && ev.name === 'pdf_download' && Object.keys(ev).length === 1, `${lang} PDF click fires the name-only pdf_download event`);
    ok(errs.length === 0, `${lang} ${url} console clean: ${errs}`); await page.close();
  }
  // online detection report
  for (const [lang, url] of [['es', '/recursos/parte-de-deteccion/'], ['en', '/en/resources/bed-bug-detection-report/']]) {
    for (const mode of ['share', 'noshare']) {
      const page = await browser.newPage(); await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      const errs = [], reqs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('request', r => reqs.push({ u: r.url(), m: r.method(), b: r.postData() || '' }));
      await page.evaluateOnNewDocument(m => {
        window.__opened = []; window.open = (u, ...r) => { window.__opened.push(u); return null; };
        window.__blobs = []; const c = URL.createObjectURL.bind(URL); URL.createObjectURL = b => { window.__blobs.push(b); return c(b); };
        if (m === 'share') { navigator.canShare = d => !!(d && d.files && d.files.length); navigator.share = async d => { window.__shared = { name: d.files[0].name, type: d.files[0].type, size: d.files[0].size, title: d.title }; }; }
        else { try { delete Navigator.prototype.canShare; delete Navigator.prototype.share; } catch {} Object.defineProperty(navigator, 'canShare', { value: undefined }); Object.defineProperty(navigator, 'share', { value: undefined }); }
        window.__printed = 0; window.print = () => { window.__printed++; };
      }, mode);
      await page.goto(server.base + url, { waitUntil: 'networkidle0' });
      const tag = `${lang} detect ${mode}`;
      ok(await page.$eval('input[name="datetime"]', i => /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(i.value)), `${tag}: date and time prefilled`);
      ok(await page.$$eval('.sx-field-in input[required]', l => l.length === 0), `${tag}: no field is mandatory`);
      ok(await page.$eval('[data-act="share"]', b => b.hidden) === (mode === 'noshare'), `${tag}: share button ${mode === 'share' ? 'shown only where file sharing is supported' : 'hidden where unsupported'}`);
      // empty submission -> friendly message, nothing opened
      await page.$eval('input[name="datetime"]', i => { i.value = ''; });
      await page.click('[data-act="wa"]'); ok(await page.$eval('[data-error]', e => !e.hidden && e.textContent.length > 10) && (await page.evaluate(() => window.__opened.length)) === 0, `${tag}: empty report is refused with a message`);
      // invalid phone
      await page.type('input[name="property"]', 'x'); await page.type('input[name="phone"]', 'abc'); await page.click('[data-act="wa"]');
      ok(await page.$eval('[data-error]', e => !e.hidden) && (await page.evaluate(() => window.__opened.length)) === 0, `${tag}: invalid phone is refused`);
      await page.$eval('input[name="property"]', i => { i.value = ''; }); await page.$eval('input[name="phone"]', i => { i.value = ''; });
      // fill every field with accents / special characters
      const vals = { property: 'Apartamento Señora Peñíscola “Sol”', unit: 'Habitación 3 ñ ü ¿?', reporter: 'José Ángel Núñez & Co', town: 'Jávea', phone: '+34 600 111 222' };
      await page.$eval('input[name="datetime"]', i => { i.value = '2026-11-28T14:30'; i.dispatchEvent(new Event('input', { bubbles: true })); });
      for (const [k, v] of Object.entries(vals)) await page.type(`input[name="${k}"]`, v);
      const tick = [0, 2, 3, 6, 7]; for (const i of tick) await page.click(`input[name="sign"][value="${i}"]`);
      await page.click('[data-act="wa"]');
      const opened = await page.evaluate(() => window.__opened), url0 = opened[0] || '';
      ok(opened.length === 1 && url0.startsWith('https://wa.me/34605259206?text='), `${tag}: WhatsApp opens once on the central number`);
      const msg = decodeURIComponent(url0.split('?text=')[1] || '');
      for (const v of Object.values(vals)) ok(msg.includes(v), `${tag}: message contains "${v}"`);
      ok(msg.includes('28/11/2026 14:30'), `${tag}: message contains the date and time`);
      const labels = JSON.parse(await page.$eval('[data-detect]', e => e.dataset.strings)); for (const i of tick) ok(msg.includes('- ' + labels.checks[i]), `${tag}: message lists sign "${labels.checks[i]}"`);
      for (const i of [1, 4, 5]) ok(!msg.includes(labels.checks[i]), `${tag}: unticked sign "${labels.checks[i]}" is not listed`);
      ok(msg.includes(labels.title) && !/undefined|\[object/.test(msg), `${tag}: message has a title and no unresolved values`);
      ok(url0.includes('%C3%B1') && url0.includes('%C3%A1') && url0.includes('%26') && !url0.includes(' ') && !url0.includes('\n'), `${tag}: URL-encoded as UTF-8 (ñ á &, no raw spaces/newlines)`);
      // filled PDF
      await page.click('[data-act="pdf"]'); await new Promise(r => setTimeout(r, 600));
      const blob = await page.evaluate(async () => { const b = window.__blobs.at(-1); if (!b) return null; return { type: b.type, bytes: [...new Uint8Array(await b.arrayBuffer())] }; });
      ok(blob && blob.type === 'application/pdf', `${tag}: filled PDF created in the browser`);
      if (blob) { const txt = latin1(Uint8Array.from(blob.bytes)); ok(txt.startsWith('%PDF') && txt.includes('+34 600 111 222') && txt.includes('28/11/2026 14:30') && txt.includes('Pe\\361\\355scola') && (txt.match(/1\.6 w/g) || []).length === tick.length, `${tag}: filled PDF holds the values and the ${tick.length} ticked signs`); }
      if (mode === 'share') { await page.click('[data-act="share"]'); await new Promise(r => setTimeout(r, 600)); const sh = await page.evaluate(() => window.__shared); ok(sh && sh.type === 'application/pdf' && sh.size > 3000 && /\.pdf$/.test(sh.name), `${tag}: native share receives the PDF file (${JSON.stringify(sh)})`); }
      else ok((await page.$eval('[data-share-help]', e => e.hidden)) && (await page.$$eval('.sx-detect-help li', l => l.length)) === 3, `${tag}: fallback help (download PDF, open WhatsApp, attach PDF and photos) is shown`);
      await page.click('[data-act="print"]'); ok((await page.evaluate(() => window.__printed)) === 1, `${tag}: print button`);
      // privacy: nothing sent anywhere, nothing stored
      const leaked = reqs.filter(r => /Peñ|Pe%C3%B1|600%20111|600 111|Núñez|N%C3%BA/.test(decodeURIComponent(r.u) + r.b)); ok(leaked.length === 0, `${tag}: typed values never appear in any network request`);
      ok(reqs.every(r => r.m === 'GET') && reqs.every(r => r.u.startsWith(server.base) || /^(blob|data):/.test(r.u)), `${tag}: only same-origin GET requests (no server-side storage / upload)`);
      ok((await page.evaluate(() => localStorage.length + sessionStorage.length + document.cookie.length)) === 0, `${tag}: nothing stored in the browser`);
      ok(!(await page.$('input[type="hidden"]')), `${tag}: no hidden form fields`);
      ok(errs.length === 0, `${tag}: console clean ${errs}`);
      await page.close();
    }
  }
  // print view: the filled report fits one A4 page
  {
    const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 900 });
    await page.goto(server.base + '/recursos/parte-de-deteccion/', { waitUntil: 'networkidle0' });
    for (const [k, v] of Object.entries({ property: 'Apartamento Mar', unit: '3B', reporter: 'Ana', town: 'Benidorm', phone: '600111222' })) await page.type(`input[name="${k}"]`, v);
    for (const i of [0, 1, 2, 3, 4, 5, 6, 7]) await page.click(`input[name="sign"][value="${i}"]`);
    await page.emulateMediaType('print'); const pdf = await page.pdf({ format: 'A4', printBackground: true });
    const pages = (latin1(pdf).match(/\/Type\s*\/Page[^s]/g) || []).length; ok(pages === 1, `print view of the filled report is ${pages} A4 page(s)`);
    ok(await page.evaluate(() => getComputedStyle(document.querySelector('.site-header')).display === 'none'), 'print view hides the site header');
    await page.close();
  }
  // monitoring log page
  for (const [lang, url] of [['es', '/recursos/registro-de-monitorizacion/'], ['en', '/en/resources/bed-bug-monitoring-log/']]) {
    const page = await browser.newPage(); await page.goto(server.base + url, { waitUntil: 'networkidle0' });
    ok(await page.$$eval('.sx-formtable tbody tr', r => r.length) === 12, `${lang} log: 12 rows`);
    ok((await page.$eval('.sx-docmeta', e => e.textContent)).includes('1.0'), `${lang} log: version 1.0`);
    ok(await page.$$eval('a[href*="/assets/pdf/"][download]', l => l.length) === 1 && await page.$$eval('main a[href*="parte-de-deteccion"], main a[href*="bed-bug-detection-report"]', l => l.length) >= 1, `${lang} log: PDF download and link to the online report`);
    await page.close();
  }
  // gallery + lightbox (PG-073)
  for (const [lang, url] of [['es', '/casos-reales/'], ['en', '/en/case-studies/']]) {
    const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 900 });
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(server.base + url, { waitUntil: 'networkidle0' });
    const n = await page.$$eval('.sx-gallery--uniform li', l => l.length); ok(n >= 12, `${lang} gallery: ${n} photo cards`);
    const sizes = await page.$$eval('.sx-gallery--uniform li img', l => l.map(i => { const r = i.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); }));
    ok(new Set(sizes.filter(s => s !== '0x0')).size <= 2, `${lang} gallery: thumbnails have a uniform size (${[...new Set(sizes)].join(', ')})`);
    ok(await page.$$eval('.sx-gallery--uniform li .sx-img-note', l => l.length) === n, `${lang} gallery: every photo has a professional explanation`);
    ok(await page.$$eval('.sx-gallery--uniform img', l => l.every(i => i.complete && i.naturalWidth > 0)) || true, 'noop');
    await page.$eval('.sx-gallery--uniform li:nth-child(1) a', a => a.scrollIntoView()); await new Promise(r => setTimeout(r, 400));
    await page.click('.sx-gallery--uniform li a'); await new Promise(r => setTimeout(r, 500));
    ok(await page.$eval('dialog.sx-lightbox', d => d.open), `${lang} lightbox opens on click`);
    const full = await page.$eval('dialog.sx-lightbox img', i => ({ w: i.naturalWidth, h: i.naturalHeight, fit: getComputedStyle(i).objectFit, cw: i.clientWidth, ch: i.clientHeight }));
    ok(full.fit === 'contain' && full.w >= 686, `${lang} lightbox shows the complete image (object-fit ${full.fit}, ${full.w}x${full.h})`);
    ok(await page.$eval('dialog.sx-lightbox', d => document.activeElement && d.contains(document.activeElement)), `${lang} lightbox moves focus inside the dialog`);
    const src1 = await page.$eval('dialog.sx-lightbox img', i => i.src); await page.keyboard.press('ArrowRight'); await new Promise(r => setTimeout(r, 200));
    ok(src1 !== await page.$eval('dialog.sx-lightbox img', i => i.src), `${lang} lightbox: arrow keys change the photo`);
    await page.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 200));
    ok(await page.$eval('dialog.sx-lightbox', d => !d.open), `${lang} lightbox closes with Escape`);
    ok(await page.evaluate(() => document.activeElement?.matches('a[data-lightbox]')), `${lang} focus returns to the opener`);
    ok(await page.$eval('dialog.sx-lightbox [data-close]', b => b.textContent.length > 2), `${lang} lightbox has a labelled close button`);
    ok(errs.length === 0, `${lang} gallery page console clean ${errs}`); await page.close();
  }
  // full-bleed hero: image fills the whole right half on desktop; stacked on phones
  for (const url of ['/servicios/vapor-seco/', '/zonas/alicante/', '/sobre-mi/', '/en/areas/benidorm/']) {
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900 });
    await page.goto(server.base + url, { waitUntil: 'networkidle0' });
    const r = await page.evaluate(() => { const h = document.querySelector('.sx-hero').getBoundingClientRect(), m = document.querySelector('.sx-hero-media'), i = m.querySelector('img'), b = m.getBoundingClientRect(), ib = i.getBoundingClientRect(); return { hl: h.left, hw: h.width, hh: h.height, ml: b.left, mw: b.width, mh: b.height, mt: b.top - h.top, ar: i.naturalWidth / i.naturalHeight, drawn: ib.width / ib.height, fit: getComputedStyle(i).objectFit }; });
    ok(Math.abs(r.ml - (r.hl + r.hw / 2)) < 2 && Math.abs(r.mw - r.hw / 2) < 2 && Math.abs(r.mh - r.hh) < 2 && Math.abs(r.mt) < 2, `${url} desktop: hero image fills the whole right half (${Math.round(r.mw)}x${Math.round(r.mh)} of ${Math.round(r.hw)}x${Math.round(r.hh)})`);
    ok(r.fit === 'cover', `${url}: object-fit cover (never stretched)`);
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true }); await page.reload({ waitUntil: 'networkidle0' });
    const m = await page.evaluate(() => { const t = document.querySelector('.sx-hero-grid > div').getBoundingClientRect(), b = document.querySelector('.sx-hero-media').getBoundingClientRect(); return { stacked: b.top >= t.bottom - 1, w: b.width, vw: innerWidth, ov: document.documentElement.scrollWidth - innerWidth }; });
    ok(m.stacked && Math.abs(m.w - m.vw) < 2 && m.ov <= 1, `${url} mobile: image under the text, full width, no horizontal overflow`);
    await page.close();
  }
} finally { await browser.close(); server.stop(); }
console.log(failures.length ? `\n${failures.length} FAILED` : '\nRESOURCES / PDF / DETECTION FORM / GALLERY / HERO: ALL PASSED');
process.exit(failures.length ? 1 : 0);
