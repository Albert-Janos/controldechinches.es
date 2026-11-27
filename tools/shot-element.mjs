// Screenshot one CSS selector of one built preview page (lazy images are scrolled into view first).
//   node tools/shot-element.mjs /servicios/vapor-seco/ ".sx-author" out.png [width]
import { join } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';
const [url, sel, out, w] = process.argv.slice(2);
const server = await startServer(4192, join(repoRoot, 'dist-preview')), browser = await launch();
try {
  const page = await browser.newPage(); await page.setViewport({ width: Number(w || 1440), height: 900 });
  await page.goto(server.base + '/' + url.split('/').filter(Boolean).join('/') + '/', { waitUntil: 'networkidle0' });
  const el = await page.$(sel); await el.scrollIntoView(); await new Promise(r => setTimeout(r, 800));
  await el.screenshot({ path: join(repoRoot, out) });
} finally { await browser.close(); server.stop(); }
