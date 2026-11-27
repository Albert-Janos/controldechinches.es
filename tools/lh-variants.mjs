// Quick Lighthouse (mobile, simulated) median for several folders: node tools/lh-variants.mjs <runs> <label=dir>...
import lighthouse from 'lighthouse';
import { startServer, launch } from './lib/browser.mjs';
const runs = +process.argv[2]; const items = process.argv.slice(3).map(a => a.split('='));
const med = a => [...a].sort((x, y) => x - y)[a.length >> 1];
const b = await launch(); const port = Number(new URL(b.wsEndpoint()).port); let p = 4210;
for (const [label, dir] of items) {
  const srv = await startServer(p++, dir); const rows = [];
  for (let i = 0; i < runs; i++) { const r = await lighthouse(srv.base + '/', { port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] }); const a = r.lhr.audits; rows.push({ perf: Math.round(r.lhr.categories.performance.score * 100), lcp: Math.round(a['largest-contentful-paint'].numericValue), tbt: Math.round(a['total-blocking-time'].numericValue), fcp: Math.round(a['first-contentful-paint'].numericValue) }); }
  console.log(label.padEnd(8), 'perf', med(rows.map(r => r.perf)), 'LCP', med(rows.map(r => r.lcp)), 'TBT', med(rows.map(r => r.tbt)), 'FCP', med(rows.map(r => r.fcp)), ' all TBT', rows.map(r => r.tbt).join(','));
  srv.stop();
}
await b.close();
