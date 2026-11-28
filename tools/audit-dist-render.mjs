// Renders EVERY html page of a built folder (default dist/) in headless Chrome at a phone and a desktop width and checks:
//   console errors, failed requests / HTTP >= 400, broken images (naturalWidth 0), <img> without width/height/alt, missing srcset/sizes on
//   content images, empty image placeholders, horizontal overflow, and layout shift (CLS).  Optional screenshots of chosen pages.
//   node tools/audit-dist-render.mjs [--dir dist] [--shots /atlas-chinches/,/en/bed-bug-atlas/] [--out reports/render]
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { startServer, launch, repoRoot } from './lib/browser.mjs';

const a = process.argv.slice(2), get = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const dirRel = get('--dir', 'dist'), dir = join(repoRoot, dirRel), shots = (get('--shots', '') || '').split(',').filter(Boolean), out = join(repoRoot, get('--out', 'reports/render'));
const urls = []; (function w(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? w(f) : n.endsWith('.html') && !/^(404|gracias)\.html$/.test(n) && urls.push('/' + relative(dir, f).split(sep).join('/').replace(/index\.html$/, '')); } })(dir);
const server = await startServer(4191, dir), browser = await launch(); const problems = []; let checked = 0, imgs = 0;
const P = (u, vp, m) => problems.push(`${u} [${vp}] ${m}`);
if (shots.length) mkdirSync(out, { recursive: true });
try {
  for (const [vp, width, height] of [['mobile', 390, 844], ['desktop', 1280, 900]]) {
    for (const u of urls) {
      const page = await browser.newPage(); await page.setViewport({ width, height, deviceScaleFactor: 1 });
      const errs = [], bad = [];
      page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url().replace(server.base, '')}`); });
      await page.evaluateOnNewDocument(() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
      await page.goto(server.base + u, { waitUntil: 'networkidle0', timeout: 60000 });
      // scroll through the page so lazy images load, then measure
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400)); });
      const info = await page.evaluate(() => ({
        imgs: [...document.querySelectorAll('img')].map(i => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, w: i.getAttribute('width'), h: i.getAttribute('height'), alt: i.getAttribute('alt'), srcset: i.getAttribute('srcset'), sizes: i.getAttribute('sizes'), inMain: !!i.closest('main'), logo: !!i.closest('.logo'), closedDialog: !!i.closest('dialog:not([open])') })).filter(i => !i.closedDialog),
        ph: document.querySelectorAll('.sx-ph, [data-image-id], .sx-draft, [data-owner-todo]').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, cls: window.__cls || 0, robots: document.querySelector('meta[name=robots]')?.content,
      }));
      checked++; imgs += info.imgs.length;
      errs.forEach(e => P(u, vp, 'console error: ' + e)); bad.forEach(b => P(u, vp, 'bad response: ' + b));
      for (const i of info.imgs) {
        if (!i.ok) P(u, vp, 'broken image ' + i.src.replace(server.base, ''));
        if (!i.w || !i.h) P(u, vp, 'img without width/height ' + i.src.replace(server.base, ''));
        if (i.alt === null) P(u, vp, 'img without alt ' + i.src.replace(server.base, ''));
        if (i.inMain && !i.logo && /\/assets\/img\//.test(i.src) && (!i.srcset || !i.sizes)) P(u, vp, 'content image without srcset/sizes ' + i.src.replace(server.base, ''));
      }
      if (info.ph) P(u, vp, `${info.ph} placeholder / draft / owner-note element(s)`);
      if (info.overflow > 1) P(u, vp, `horizontal overflow ${info.overflow}px`);
      if (info.cls > 0.1) P(u, vp, `CLS ${info.cls.toFixed(3)}`);
      if (/noindex/.test(info.robots || '') && !/(aviso-legal|politica-privacidad)/.test(u)) P(u, vp, 'unexpected noindex: ' + info.robots);
      if (shots.includes(u)) await page.screenshot({ path: join(out, `${u.replace(/\//g, '_') || '_home'}-${vp}.png`), fullPage: true });
      await page.close();
    }
  }
} finally { await browser.close(); server.stop(); }
console.log(`rendered ${checked} page views (${urls.length} pages x 2 viewports), ${imgs} <img> checked`);
problems.forEach(p => console.log('  PROBLEM', p));
console.log(problems.length ? `${problems.length} problem(s)` : 'RENDER AUDIT: no problems');
process.exit(problems.length ? 1 : 0);
