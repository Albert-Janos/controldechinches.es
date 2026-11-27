// Video block on the dry steam page (ES + EN, phone + desktop): no video bytes on load, plays only after a click, compact size, no layout shift.
// Usage: node tests/test-video.mjs
import { join } from 'node:path';
import { packageSite } from '../tools/package-site.mjs';
import { startServer, launch, repoRoot } from '../tools/lib/browser.mjs';

packageSite({ mode: 'preview', out: 'dist-preview', pageDirs: [] });
const server = await startServer(4186, join(repoRoot, 'dist-preview')), browser = await launch();
const failures = []; const ok = (c, m) => { console.log(c ? '  ok  ' : '  FAIL', m); if (!c) failures.push(m); };
try {
  for (const [lang, url] of [['es', '/servicios/vapor-seco/'], ['en', '/en/services/dry-steam/']]) for (const [vn, vp] of [['390', { width: 390, height: 844, isMobile: true, hasTouch: true }], ['1440', { width: 1440, height: 900 }]]) {
    const page = await browser.newPage(); await page.setViewport(vp);
    const reqs = []; page.on('request', r => reqs.push(r.url()));
    await page.evaluateOnNewDocument(() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await page.goto(server.base + url, { waitUntil: 'networkidle0' });
    const tag = `${lang} ${vn}`;
    ok(!reqs.some(u => /\.webm/.test(u)), `${tag}: no video file requested when the page opens`);
    ok(await page.$eval('.sx-video', f => !f.querySelector('video')), `${tag}: no <video> element before the click`);
    await page.$eval('.sx-video', f => f.scrollIntoView({ block: 'center' })); await new Promise(r => setTimeout(r, 700));
    const box = await page.$eval('.sx-video', f => { const r = f.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
    ok(box.w <= (vn === '390' ? 215 : 260) && box.h <= 560, `${tag}: compact display size (${box.w}x${box.h})`);
    ok(await page.$eval('.sx-video img', i => i.complete && i.naturalWidth > 0 && i.getAttribute('width') === '540' && i.getAttribute('height') === '960'), `${tag}: poster loads, has width/height`);
    await page.click('.sx-video-btn');
    await page.waitForFunction(() => { const v = document.querySelector('.sx-video video'); return v && v.readyState >= 2 && !v.paused; }, { timeout: 8000 }).catch(() => {});
    const st = await page.evaluate(() => { const v = document.querySelector('.sx-video video'); return v ? { paused: v.paused, ready: v.readyState, controls: v.controls, autoplayAttr: v.hasAttribute('autoplay'), loop: v.loop, w: v.videoWidth, h: v.videoHeight } : null; });
    ok(st && !st.paused && st.ready >= 2 && st.controls && st.w === 540 && st.h === 960 && !st.autoplayAttr, `${tag}: plays after the click, with controls (${JSON.stringify(st)})`);
    ok(reqs.some(u => /\.webm/.test(u)), `${tag}: video file requested only after the click`);
    ok(await page.evaluate(() => window.__cls) < 0.02, `${tag}: no layout shift (CLS ${await page.evaluate(() => window.__cls)})`);
    await page.close();
  }
} finally { await browser.close(); server.stop(); }
console.log(failures.length ? `\n${failures.length} FAILED` : '\nVIDEO CHECKS PASSED');
process.exit(failures.length ? 1 : 0);
