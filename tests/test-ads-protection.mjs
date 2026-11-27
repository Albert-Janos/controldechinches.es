// Google Ads landing protection test (docs/seo/ADS-PROTECTION.md).
//   node tests/test-ads-protection.mjs            verify against the recorded baseline
//   node tests/test-ads-protection.mjs --update   record a NEW baseline (only after explicit owner approval of a change)
// Checks: (1) protected files unchanged vs baseline commit, (2) conversion DOM snapshot (H1, every data-cta link + href, phone/WhatsApp),
//         (3) tracking config untouched, (4) the production package contains the protected files byte-for-byte.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { startServer, launch, repoRoot } from '../tools/lib/browser.mjs';
import { packageSite } from '../tools/package-site.mjs';

const cfgFile = join(repoRoot, 'data/ads-protection.json');
const cfg = JSON.parse(readFileSync(cfgFile, 'utf8'));
const update = process.argv.includes('--update');
const failures = []; const ok = (c, m) => { if (!c) { failures.push(m); console.log('  FAIL', m); } };

// (1) bytes vs baseline commit (line-ending independent: git compares normalised content)
if (!update) for (const f of cfg.protectedFiles) {
  try { execFileSync('git', ['diff', '--exit-code', '--quiet', cfg.baselineCommit, '--', f], { cwd: repoRoot }); }
  catch { failures.push(`protected file changed since baseline ${cfg.baselineCommit}: ${f}`); console.log('  FAIL changed:', f); }
}

// (2) DOM snapshot
const server = await startServer(4185); const browser = await launch(); const snap = {};
try {
  for (const p of cfg.pages) {
    const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 900 });
    await page.goto(server.base + p, { waitUntil: 'networkidle0' });
    snap[p] = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' '),
      dataPage: document.body.dataset.page,
      cta: [...document.querySelectorAll('a[data-cta]')].map(a => `${a.dataset.cta}|${a.protocol === 'tel:' ? a.getAttribute('href') : a.origin + a.pathname}`),
      tel: [...new Set([...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href')))],
      wa: [...new Set([...document.querySelectorAll('a[href*="wa.me"]')].map(a => new URL(a.href).pathname))],
      heroPrice: document.querySelector('.hero-price')?.textContent.replace(/\s+/g, ' ').trim() || null,
    }));
    await page.close();
  }
} finally { await browser.close(); server.stop(); }
if (update) { cfg.snapshot = snap; writeFileSync(cfgFile, JSON.stringify(cfg, null, 2) + '\n'); console.log('baseline snapshot updated for', Object.keys(snap).length, 'pages'); process.exit(0); }
for (const p of cfg.pages) {
  const a = cfg.snapshot[p], b = snap[p];
  ok(!!a, `${p}: no baseline snapshot`); if (!a) continue;
  ok(a.h1 === b.h1, `${p}: H1 changed "${a.h1}" -> "${b.h1}"`);
  ok(a.dataPage === b.dataPage, `${p}: data-page changed`);
  ok(JSON.stringify(a.cta) === JSON.stringify(b.cta), `${p}: data-cta links changed (${a.cta.length} -> ${b.cta.length})`);
  ok(JSON.stringify(a.tel) === JSON.stringify(b.tel) && a.tel.every(t => t === 'tel:+34605259206'), `${p}: phone links`);
  ok(JSON.stringify(a.wa) === JSON.stringify(b.wa) && a.wa.every(w => w === '/34605259206'), `${p}: WhatsApp number`);
  ok(a.heroPrice === b.heroPrice, `${p}: hero price changed`);
}
// (3) tracking config
const mc = readFileSync(join(repoRoot, 'js/measurement-config.js'), 'utf8');
ok(/ga4Id: ''/.test(mc) && /adsId: ''/.test(mc), 'measurement-config.js must not contain invented IDs');
// (4) package contents
packageSite({ mode: 'production', out: 'dist-ads-test' });
for (const f of cfg.protectedFiles) {
  if (!existsSync(join(repoRoot, f))) continue;
  const h = p => createHash('sha256').update(readFileSync(p)).digest('hex');
  if (f === 'sitemap.xml') continue; // regenerated (identical until pages are approved)
  ok(existsSync(join(repoRoot, 'dist-ads-test', f)) && h(join(repoRoot, f)) === h(join(repoRoot, 'dist-ads-test', f)), `package differs from working tree: ${f}`);
}
console.log(failures.length ? `\n${failures.length} FAILED` : '\nADS PROTECTION: ALL PASSED');
process.exit(failures.length ? 1 : 0);
