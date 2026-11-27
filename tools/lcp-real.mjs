// Real-throttle LCP/FCP comparison (no Lantern simulation): Chrome CPU 4x slowdown + "Slow 4G" network, mobile viewport, cold cache.
//   node tools/lcp-real.mjs <beforeDir> <afterDir> [runs=7] [paths=/,/en/]
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';

const [beforeDir, afterDir, runsArg = '7', pathsArg = '/,/en/'] = process.argv.slice(2);
const runs = +runsArg, paths = pathsArg.split(',');
const A = await startServer(4196, beforeDir), B = await startServer(4197, afterDir), browser = await launch();
const median = a => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const out = {};
async function once(url) {
  const ctx = await browser.createBrowserContext(); const page = await ctx.newPage();
  const cdp = await page.createCDPSession();
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluateOnNewDocument(() => { window.__lcp = 0; window.__tbt = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true }); new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0), load: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd), tbt: Math.round(window.__tbt) }));
  await ctx.close(); return m;
}
try {
  for (const p of paths) {
    const acc = { before: [], after: [] };
    for (let i = 0; i < runs; i++) for (const [label, s] of [['before', A], ['after', B]]) acc[label].push(await once(s.base + p));
    out[p] = Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, { median: { lcp: median(v.map(x => x.lcp)), fcp: median(v.map(x => x.fcp)), load: median(v.map(x => x.load)), tbt: median(v.map(x => x.tbt)) }, runs: v }]));
    console.log(p, 'LCP median before/after', out[p].before.median.lcp, out[p].after.median.lcp, ' FCP', out[p].before.median.fcp, out[p].after.median.fcp, ' load', out[p].before.median.load, out[p].after.median.load, ' TBT', out[p].before.median.tbt, out[p].after.median.tbt);
  }
  writeFileSync(join(repoRoot, 'reports', 'perf-home-lcp-real-throttle.json'), JSON.stringify({ date: new Date().toISOString().slice(0, 10), method: 'Chrome CDP: CPU 4x, 150 ms RTT, 1.6 Mbps down, cold cache, 412x823@1.75; LCP via PerformanceObserver', out }, null, 2));
} finally { await browser.close(); A.stop(); B.stop(); }
