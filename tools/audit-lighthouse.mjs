// Lighthouse (mobile + desktop) for a list of paths. Writes reports/raw/lh/*.json (ignored) and a summary JSON.
// Usage: node tools/audit-lighthouse.mjs <baseUrl> <out-name> [paths...]
//   e.g. node tools/audit-lighthouse.mjs https://www.controldechinches.es live-baseline / /precios.html
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch, repoRoot } from './lib/browser.mjs';

const [base, name, ...paths] = process.argv.slice(2);
const list = paths.length ? paths : ['/', '/en/', '/precios.html', '/en/prices.html', '/chinches-apartamentos-turisticos/', '/en/bed-bugs-holiday-rentals/'];
const raw = join(repoRoot, 'reports/raw/lh'); mkdirSync(raw, { recursive: true });
const browser = await launch();
const port = new URL(browser.wsEndpoint()).port;
const rows = [];
try {
  for (const p of list) for (const mode of ['mobile', 'desktop']) {
    const url = base.replace(/\/$/, '') + p;
    const r = await lighthouse(url, { port: Number(port), output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, mode === 'desktop' ? desktopConfig : undefined);
    const l = r.lhr, a = l.audits, sc = k => Math.round((l.categories[k].score ?? 0) * 100);
    const row = { url: p, mode, performance: sc('performance'), accessibility: sc('accessibility'), bestPractices: sc('best-practices'), seo: sc('seo'),
      lcp_ms: Math.round(a['largest-contentful-paint'].numericValue), cls: +a['cumulative-layout-shift'].numericValue.toFixed(3), tbt_ms: Math.round(a['total-blocking-time'].numericValue),
      fcp_ms: Math.round(a['first-contentful-paint'].numericValue), si_ms: Math.round(a['speed-index'].numericValue), transfer_kb: Math.round((a['total-byte-weight'].numericValue || 0) / 1024),
      failedAudits: Object.values(a).filter(x => x.score === 0 && x.scoreDisplayMode !== 'notApplicable').map(x => x.id) };
    rows.push(row); console.log(JSON.stringify(row));
    writeFileSync(join(raw, `${name}${p.replace(/[\/.]/g, '_')}-${mode}.json`), JSON.stringify(l));
  }
} finally { await browser.close(); }
writeFileSync(join(repoRoot, 'reports', `${name}-lighthouse.json`), JSON.stringify({ date: new Date().toISOString().slice(0, 10), base, lighthouse: '13.6.0', note: 'single run per page/mode; lab data only', rows }, null, 2));
console.log('summary written');
