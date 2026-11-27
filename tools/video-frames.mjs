// Inspect a video in headless Chrome: metadata + still frames (for privacy review and poster images).  Read-only.
//   node tools/video-frames.mjs <video file> <out dir> [count=8]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, basename, join, resolve } from 'node:path';
import { startServer, launch } from './lib/browser.mjs';
const [file, out, n = '8'] = process.argv.slice(2);
const abs = resolve(file); mkdirSync(out, { recursive: true });
const server = await startServer(4193, dirname(abs)), browser = await launch();
try {
  const page = await browser.newPage(); await page.setViewport({ width: 800, height: 600 });
  await page.goto(`${server.base}/${encodeURIComponent(basename(abs))}`); // a bare media document is same-origin, so its frames can be exported
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2, { timeout: 20000 });
  const meta = await page.evaluate(() => { const v = document.querySelector('video'); return { w: v.videoWidth, h: v.videoHeight, duration: v.duration }; });
  console.log(JSON.stringify(meta));
  for (let i = 0; i < Number(n); i++) {
    const t = Math.min(meta.duration - 0.05, (meta.duration * (i + 0.5)) / Number(n));
    const data = await page.evaluate(async t => { const v = document.querySelector('video'); v.currentTime = t; await new Promise(r => v.addEventListener('seeked', r, { once: true })); const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); return c.toDataURL('image/png').split(',')[1]; }, t);
    writeFileSync(join(out, `frame-${String(i).padStart(2, '0')}-${t.toFixed(1)}s.png`), Buffer.from(data, 'base64')); console.log('frame', i, t.toFixed(2));
  }
} finally { await browser.close(); server.stop(); }
