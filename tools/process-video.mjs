// Web version of the owner's short work video (no ffmpeg on this machine: headless Chrome does the re-encoding).
//   node tools/process-video.mjs <raw video> <seo-name> [width=540]
// Output (assets/video/, git-tracked): <seo-name>.webm  (VP9, NO audio track, NO container metadata: the camera model and any voices of the
// original are not carried over) and <seo-name>-poster-{360,540}.{webp,avif}.  Never writes into the raw folder.
// Also prints the metadata atoms found in the ORIGINAL (device model etc.) so the privacy review is documented.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { startServer, launch } from './lib/browser.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const [file, name, wArg = '540'] = process.argv.slice(2);
const abs = resolve(file), W = Number(wArg), outDir = join(root, 'assets/video'); mkdirSync(outDir, { recursive: true });
const buf = readFileSync(abs), s = buf.toString('latin1');
console.log('original:', (statSync(abs).size / 1024).toFixed(0) + ' KB; metadata atoms:', ['smta', 'udta', 'com.android', 'loci', 'xyz'].filter(t => s.includes(t)).join(', ') || 'none', '; device tag:', (s.match(/SM-[A-Z0-9]+|Galaxy [A-Z0-9]+/g) || []).join(' / ') || '-');
const server = await startServer(4194, dirname(abs)), browser = await launch();
try {
  const page = await browser.newPage(); await page.setViewport({ width: 600, height: 800 });
  await page.goto(`${server.base}/${encodeURIComponent(basename(abs))}`);
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2, { timeout: 20000 });
  const res = await page.evaluate(async W => {
    const v = document.querySelector('video'); v.muted = true; v.loop = false; v.currentTime = 0;
    const H = Math.round(W * v.videoHeight / v.videoWidth / 2) * 2, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(c.captureStream(30), { mimeType: mime, videoBitsPerSecond: 900000 }), chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    const done = new Promise(r => { rec.onstop = r; });
    const draw = () => { g.drawImage(v, 0, 0, W, H); if (!v.ended) requestAnimationFrame(draw); };
    rec.start(100); await v.play(); draw(); await new Promise(r => { v.onended = r; }); await new Promise(r => setTimeout(r, 150)); rec.stop(); await done;
    const blob = new Blob(chunks, { type: 'video/webm' }), ab = new Uint8Array(await blob.arrayBuffer()); let bin = ''; for (let i = 0; i < ab.length; i += 0x8000) bin += String.fromCharCode(...ab.subarray(i, i + 0x8000));
    // poster: a sharp, representative frame at full resolution
    v.pause(); v.currentTime = Math.min(0.45, v.duration - 0.05); await new Promise(r => v.addEventListener('seeked', r, { once: true }));
    const pc = document.createElement('canvas'); pc.width = v.videoWidth; pc.height = v.videoHeight; pc.getContext('2d').drawImage(v, 0, 0);
    return { mime, W, H, webm: btoa(bin), poster: pc.toDataURL('image/png').split(',')[1], duration: v.duration, vw: v.videoWidth, vh: v.videoHeight };
  }, W);
  writeFileSync(join(outDir, `${name}.webm`), Buffer.from(res.webm, 'base64'));
  const poster = Buffer.from(res.poster, 'base64');
  for (const w of [360, 540]) {
    await sharp(poster).resize({ width: w }).webp({ quality: 76, effort: 5 }).toFile(join(outDir, `${name}-poster-${w}.webp`));
    await sharp(poster).resize({ width: w }).avif({ quality: 50, effort: 3 }).toFile(join(outDir, `${name}-poster-${w}.avif`));
  }
  const meta = { name, mime: res.mime, width: res.W, height: res.H, duration: +res.duration.toFixed(2), sourceWidth: res.vw, sourceHeight: res.vh, bytes: statSync(join(outDir, `${name}.webm`)).size, audio: false, posterWidths: [360, 540], originalKB: Math.round(statSync(abs).size / 1024) };
  writeFileSync(join(root, 'data/videos.json'), JSON.stringify({ [name]: meta }, null, 1) + '\n');
  console.log(JSON.stringify(meta));
} finally { await browser.close(); server.stop(); }
