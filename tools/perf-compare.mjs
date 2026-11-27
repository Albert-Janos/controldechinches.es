// Before/after comparison: Lighthouse medians + above-the-fold screenshots + pixel difference.
//   node tools/perf-compare.mjs <beforeDir> <afterDir> <outName> [runsMobile=5] [runsDesktop=3] [paths=/,/en/]
// Both folders are served by tools/serve.mjs (gzip + production cache headers) and measured alternately (A,B,A,B...) to cancel drift.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import sharp from 'sharp';
import { startServer, launch, repoRoot } from './lib/browser.mjs';

const [beforeDir, afterDir, name, rm = '5', rd = '3', pathsArg = '/,/en/'] = process.argv.slice(2);
const paths = pathsArg.split(','), runsM = +rm, runsD = +rd;
const A = await startServer(4191, beforeDir), B = await startServer(4192, afterDir), browser = await launch();
const port = Number(new URL(browser.wsEndpoint()).port);
const median = a => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const results = {};
const outDir = join(repoRoot, 'reports', name); mkdirSync(outDir, { recursive: true });
try {
  for (const p of paths) for (const [mode, runs] of [['mobile', runsM], ['desktop', runsD]]) {
    const acc = { before: [], after: [] };
    for (let i = 0; i < runs; i++) for (const [label, srv] of [['before', A], ['after', B]]) {
      const r = await lighthouse(srv.base + p, { port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, mode === 'desktop' ? desktopConfig : undefined);
      const l = r.lhr, a = l.audits, sc = k => Math.round(l.categories[k].score * 100);
      acc[label].push({ perf: sc('performance'), a11y: sc('accessibility'), bp: sc('best-practices'), seo: sc('seo'), lcp: Math.round(a['largest-contentful-paint'].numericValue), fcp: Math.round(a['first-contentful-paint'].numericValue), tbt: Math.round(a['total-blocking-time'].numericValue), cls: +a['cumulative-layout-shift'].numericValue.toFixed(3), si: Math.round(a['speed-index'].numericValue), kb: Math.round(a['total-byte-weight'].numericValue / 1024), requests: a['network-requests'].details.items.length });
    }
    const med = rows => Object.fromEntries(Object.keys(rows[0]).map(k => [k, median(rows.map(r => r[k]))]));
    results[`${p} ${mode}`] = { runs, before: med(acc.before), after: med(acc.after), allBefore: acc.before, allAfter: acc.after };
    console.log(p, mode, 'LCP median ms before/after:', med(acc.before).lcp, med(acc.after).lcp, ' perf', med(acc.before).perf, med(acc.after).perf);
  }
  // screenshots + pixel difference
  const diffs = {};
  for (const p of paths) for (const [vn, vp] of [['mobile', { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['desktop', { width: 1280, height: 900 }]]) {
    const shot = {};
    for (const [label, srv] of [['before', A], ['after', B]]) {
      const page = await browser.newPage(); await page.setViewport(vp); await page.goto(srv.base + p, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      const file = join(outDir, `${p.replace(/[/.]/g, '_') || '_'}${vn}-${label}.png`);
      await page.screenshot({ path: file }); shot[label] = file; await page.close();
    }
    const [x, y] = await Promise.all([sharp(shot.before).raw().toBuffer({ resolveWithObject: true }), sharp(shot.after).raw().toBuffer({ resolveWithObject: true })]);
    let diff = 0, strong = 0; const n = x.info.width * x.info.height;
    for (let i = 0; i < x.data.length; i += x.info.channels) { const d = Math.abs(x.data[i] - y.data[i]) + Math.abs(x.data[i + 1] - y.data[i + 1]) + Math.abs(x.data[i + 2] - y.data[i + 2]); if (d > 24) diff++; if (d > 120) strong++; }
    diffs[`${p} ${vn}`] = { pixelsDifferentPct: +(100 * diff / n).toFixed(2), pixelsStronglyDifferentPct: +(100 * strong / n).toFixed(2) };
    console.log(p, vn, 'pixel diff %', diffs[`${p} ${vn}`]);
  }
  writeFileSync(join(repoRoot, 'reports', `${name}.json`), JSON.stringify({ date: new Date().toISOString().slice(0, 10), lighthouse: '13.6.0', setup: 'local server, gzip + production cache headers, alternating runs; lab data', results, visualDiff: diffs }, null, 2));
} finally { await browser.close(); A.stop(); B.stop(); }
