// Read-only layout audit of the PREVIEW build (images sizes, SVG text overflow, duplicate ids, horizontal overflow).
//   node tools/audit-layout.mjs [--out reports/raw/layout.json] [--only PG-016,PG-012] [--shots reports/raw/shots]
// Builds dist-preview itself; never touches tracked files.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { packageSite } from './package-site.mjs';
import { startServer, launch, repoRoot } from './lib/browser.mjs';
import { loadPages } from './build.mjs';

const a = process.argv.slice(2), get = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const only = get('--only')?.split(','), outFile = get('--out'), shotDir = get('--shots');
packageSite({ mode: 'preview', out: 'dist-preview', pageDirs: [] });
const pages = Object.values(loadPages(['data/pages'])).filter(p => !only || only.includes(p.id));
const server = await startServer(4191, join(repoRoot, 'dist-preview')), browser = await launch();
const widths = [[390, 844], [1440, 900]];
const report = [], problems = [];
if (shotDir) mkdirSync(join(repoRoot, shotDir), { recursive: true });
try {
  for (const p of pages) for (const lang of ['es', 'en']) {
    if (!p[lang]) continue;
    for (const [w, h] of widths) {
      const page = await browser.newPage(); await page.setViewport({ width: w, height: h, isMobile: w < 500, hasTouch: w < 500 });
      let imgBytes = 0, imgCount = 0, failed = [];
      page.on('response', async res => { const t = res.headers()['content-type'] || ''; if (/^image\//.test(t) && !/svg|icon/.test(t)) { imgCount++; try { imgBytes += (await res.buffer()).length; } catch { /* redirect or aborted */ } } if (res.status() >= 400) failed.push(res.status() + ' ' + res.url()); });
      await page.evaluateOnNewDocument(() => { // Core Web Vitals probes (LCP element/time, CLS) - same numbers the browser would report
        window.__cls = 0; window.__lcp = 0; window.__lcpEl = '';
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver(l => { const e = l.getEntries().at(-1); window.__lcp = Math.round(e.startTime); window.__lcpEl = (e.element?.tagName || '') + ' ' + (e.url || '').split('/').pop(); }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
      await page.goto(server.base + p[lang].url, { waitUntil: 'networkidle0' });
      const firstView = await page.evaluate(() => ({ lcp: window.__lcp, lcpEl: window.__lcpEl }));
      const firstBytes = imgBytes;
      // scroll through the page so every lazy image really loads (broken paths show up) and late layout shifts are counted
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForNetworkIdle({ idleTime: 400, timeout: 8000 }).catch(() => {});
      const r = await page.evaluate(() => {
        const rect = el => { const b = el.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; };
        const imgs = [...document.querySelectorAll('main img, main .sx-ph')].filter(e => e.offsetParent).map(e => ({ id: e.dataset.imageId || e.getAttribute('src'), kind: e.tagName === 'IMG' ? 'img' : 'ph', ...rect(e), cls: e.className, inHero: !!e.closest('.sx-hero') }));
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id), dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);
        const svgs = [...document.querySelectorAll('.sx-ig svg')].filter(s => s.getBoundingClientRect().width > 0).map(svg => {
          const over = [];
          svg.querySelectorAll('g').forEach(g => {
            const rc = g.querySelector(':scope > rect'); if (!rc) return;
            const rb = rc.getBBox();
            g.querySelectorAll('text').forEach(t => { const b = t.getBBox(); if (b.x + b.width > rb.x + rb.width - 2 || b.y + b.height > rb.y + rb.height - 2 || b.x < rb.x) over.push(t.textContent.slice(0, 40)); });
          });
          const vb = svg.viewBox.baseVal; svg.querySelectorAll('text').forEach(t => { const b = t.getBBox(); if (b.x < 0 || b.y < 0 || b.x + b.width > vb.width || b.y + b.height > vb.height) over.push('(outside viewBox) ' + t.textContent.slice(0, 40)); });
          const b = svg.getBoundingClientRect(); return { cls: svg.getAttribute('class'), w: Math.round(b.width), h: Math.round(b.height), over };
        });
        const title = document.querySelector('.sx-todo') ? 0 : 1;
        const broken = [...document.querySelectorAll('main img')].filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.getAttribute('src'));
        return { broken, cls: Math.round(window.__cls * 1000) / 1000, imgs, dupIds: [...new Set(dupIds)], svgs, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      const tag = `${p.id} ${lang} ${w}`;
      report.push({ tag, ...r, ...firstView, firstViewImgKB: Math.round(firstBytes / 1024), totalImgKB: Math.round(imgBytes / 1024), imgCount, failed });
      if (r.broken.length) problems.push(`${tag}: broken image(s) ${r.broken.join(', ')}`);
      if (failed.length) problems.push(`${tag}: failed requests ${failed.join(', ')}`);
      if (r.cls > 0.02) problems.push(`${tag}: CLS ${r.cls}`);
      if (r.overflow > 1) problems.push(`${tag}: horizontal overflow ${r.overflow}px`);
      if (r.dupIds.length) problems.push(`${tag}: duplicate ids ${r.dupIds.join(',')}`);
      r.svgs.forEach(s => s.over.length && problems.push(`${tag}: svg text overflow (${s.cls}): ${s.over.join(' | ')}`));
      const dupImg = r.imgs.map(i => i.id).filter((x, i, arr) => arr.indexOf(x) !== i && x); if (dupImg.length) problems.push(`${tag}: same image id repeated ${[...new Set(dupImg)].join(',')}`);
      if (shotDir) await page.screenshot({ path: join(repoRoot, shotDir, `${p.id}-${lang}-${w}.png`), fullPage: true });
      await page.close();
    }
  }
} finally { await browser.close(); server.stop(); }
if (outFile) { mkdirSync(join(repoRoot, outFile, '..'), { recursive: true }); writeFileSync(join(repoRoot, outFile), JSON.stringify(report, null, 1)); }
const big = report.flatMap(r => r.imgs.filter(i => i.w >= 300 && i.h >= 700 || i.h > 800).map(i => `${r.tag} ${i.id} ${i.w}x${i.h}`));
console.log(`layout audit: ${report.length} page views`);
if (big.length) console.log('tall images:\n  ' + big.join('\n  '));
problems.forEach(x => console.log('  PROBLEM ' + x));
console.log(`${problems.length} problem(s)`);
process.exit(0);
