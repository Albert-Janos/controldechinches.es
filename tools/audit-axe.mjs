// axe-core accessibility audit (WCAG 2.2 AA tags) on desktop + mobile viewports, local server.
// Usage: node tools/audit-axe.mjs [paths...]   -> prints summary, writes reports/axe.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';

const axeSrc = readFileSync(join(repoRoot, 'tools/node_modules/axe-core/axe.min.js'), 'utf8');
const dirEnv = process.env.AXE_DIR ? join(repoRoot, process.env.AXE_DIR) : undefined;
const fromSitemap = dirEnv ? [...readFileSync(join(dirEnv, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/www\.controldechinches\.es([^<]*)<\/loc>/g)].map(m => m[1]) : null;
const list = process.argv.slice(2).length ? process.argv.slice(2) : fromSitemap ? fromSitemap : ['/', '/en/', '/precios.html', '/en/prices.html', '/chinches-apartamentos-turisticos/', '/en/bed-bugs-holiday-rentals/', '/aviso-legal.html', '/politica-privacidad.html', '/404.html'];
const server = await startServer(4183, dirEnv); const browser = await launch(); const results = [];
try {
  for (const p of list) for (const [mode, vp] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 375, height: 812, isMobile: true, hasTouch: true }]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    await page.goto(server.base + p, { waitUntil: 'networkidle0' });
    await page.evaluate(axeSrc);
    const r = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    const v = r.violations.map(x => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, help: x.help, sample: x.nodes[0]?.target?.join(' ') }));
    results.push({ path: p, mode, violations: v, incomplete: r.incomplete.length, passes: r.passes.length });
    console.log(`${p} [${mode}] violations=${v.length} ${v.map(x => `${x.id}(${x.impact},${x.nodes})`).join(' ')}`);
    await page.close();
  }
} finally { await browser.close(); server.stop(); }
mkdirSync(join(repoRoot, 'reports'), { recursive: true });
writeFileSync(join(repoRoot, 'reports/axe.json'), JSON.stringify({ date: new Date().toISOString().slice(0, 10), axe: '4.14.1', results }, null, 2));
