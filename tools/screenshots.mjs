// Full-page screenshots (desktop 1280 + mobile 375) of the given paths -> reports/raw/shots/
// Usage: node tools/screenshots.mjs / /precios.html /en/prices.html
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';

const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/precios.html'];
const out = join(repoRoot, 'reports/raw/shots'); mkdirSync(out, { recursive: true });
const server = await startServer(4182); const browser = await launch();
try {
  for (const p of paths) for (const [name, vp] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    await page.goto(server.base + p, { waitUntil: 'networkidle0' });
    const file = join(out, (p.replace(/[\/.]/g, '_') || '_') + '-' + name + '.png');
    await page.screenshot({ path: file, fullPage: true }); console.log(file); await page.close();
  }
} finally { await browser.close(); server.stop(); }
