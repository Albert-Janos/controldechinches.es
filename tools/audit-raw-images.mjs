// Read-only inventory of the owner's raw images: format, pixel size, bytes, EXIF/GPS presence, perceptual hash (duplicate finder),
// plus a contact-sheet-sized preview written to reports/raw/previews (git-ignored).  Never writes into the raw folder.
//   node tools/audit-raw-images.mjs [rawDir]
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const raw = process.argv[2] || join(root, '..', '..', '..', 'raw-images');
const prev = join(root, 'reports/raw/previews'); mkdirSync(prev, { recursive: true });
const walk = d => readdirSync(d).flatMap(n => { const f = join(d, n); return statSync(f).isDirectory() ? walk(f) : [f]; });
const rows = [];
for (const f of walk(raw).sort()) {
  if (!/\.(webp|avif|png|jpe?g)$/i.test(f)) { rows.push({ file: relative(raw, f), skipped: extname(f), bytes: statSync(f).size }); continue; }
  const img = sharp(f), m = await img.metadata();
  const small = await sharp(f).resize(16, 16, { fit: 'fill' }).greyscale().raw().toBuffer(), avg = small.reduce((a, b) => a + b, 0) / small.length;
  const hash = [...small].map(v => (v > avg ? 1 : 0)).join('');
  const name = relative(raw, f).replace(/[\\/ ]/g, '_').replace(/\.\w+$/, '') + '.jpg';
  await sharp(f).resize({ width: 1000, withoutEnlargement: true }).jpeg({ quality: 78 }).toFile(join(prev, name));
  rows.push({ file: relative(raw, f).split('\\').join('/'), fmt: m.format, w: m.width, h: m.height, bytes: statSync(f).size, exif: !!m.exif, icc: !!m.icc, xmp: !!m.xmp, alpha: m.hasAlpha, hash, preview: name });
}
for (const a of rows) { if (!a.hash) continue; for (const b of rows) if (b !== a && b.hash && a.file < b.file) { const d = [...a.hash].filter((c, i) => c !== b.hash[i]).length; if (d < 20) a.similar = [...(a.similar || []), `${b.file} (${d})`]; } }
for (const r of rows) console.log(r.skipped ? `SKIP ${r.file} ${r.skipped} ${r.bytes}` : `${r.file} | ${r.fmt} ${r.w}x${r.h} | ${(r.bytes / 1024).toFixed(0)} KB | exif=${r.exif} icc=${r.icc} xmp=${r.xmp} | ${r.preview}${r.similar ? ' | SIMILAR ' + r.similar.join(', ') : ''}`);
console.log('total bytes', rows.reduce((t, r) => t + r.bytes, 0));
