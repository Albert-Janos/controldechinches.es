// Before/after size report for the owner's raw images (read-only): raw bytes vs. generated files per asset + the bytes one visitor downloads
// (smallest and largest srcset candidate, AVIF preferred).   node tools/image-report.mjs  -> reports/image-optimization.json
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const csv = readFileSync(join(root, 'data/images-assign.csv'), 'utf8');
import { parseCsv } from './lib/csv.mjs';
const rows = parseCsv(csv), proc = JSON.parse(readFileSync(join(root, 'data/images-processed.json'), 'utf8'));
const rawDir = join(root, '..', '..', '..', 'raw-images');
const sz = f => (existsSync(f) ? statSync(f).size : 0);
const seen = new Set(), items = []; let rawTotal = 0, outTotal = 0, rawUsed = 0;
for (const r of rows) {
  const raw = sz(join(rawDir, r.file)); if (!seen.has(r.file)) { seen.add(r.file); rawTotal += raw; }
  if (!r.asset_id || r.same_as || r.approved !== 'yes') continue;
  const d = proc[r.asset_id], v = d.variants, dir = join(root, 'assets/img', v.dir.replace('/assets/img/', ''));
  let all = 0; for (const w of v.widths) for (const f of v.formats) all += sz(join(dir, `${v.base}-${w}.${f}`));
  const fmt = v.formats.includes('avif') ? 'avif' : 'webp', small = sz(join(dir, `${v.base}-${v.widths[0]}.${fmt}`)), large = sz(join(dir, `${v.base}-${v.widths.at(-1)}.${fmt}`));
  rawUsed += raw; outTotal += all; items.push({ id: r.asset_id, file: r.file, rawKB: Math.round(raw / 1024), generatedKB: Math.round(all / 1024), smallestServedKB: Math.round(small / 1024), largestServedKB: Math.round(large / 1024), widths: v.widths, formats: v.formats });
}
const out = { rawFilesTotalMB: +(rawTotal / 1048576).toFixed(1), rawUsedMB: +(rawUsed / 1048576).toFixed(1), generatedTotalMB: +(outTotal / 1048576).toFixed(1), items };
writeFileSync(join(root, 'reports/image-optimization.json'), JSON.stringify(out, null, 1) + '\n');
const sum = k => items.reduce((t, i) => t + i[k], 0);
console.log(JSON.stringify({ rawFilesTotalMB: out.rawFilesTotalMB, rawUsedMB: out.rawUsedMB, generatedAllVariantsMB: out.generatedTotalMB, servedLargestOnlyMB: +(sum('largestServedKB') / 1024).toFixed(2), servedSmallestOnlyMB: +(sum('smallestServedKB') / 1024).toFixed(2), images: items.length }));
const png = items.filter(i => /\.png$/.test(i.file)); console.log('PNG originals', png.length, (png.reduce((t, i) => t + i.rawKB, 0) / 1024).toFixed(1) + ' MB ->', (png.reduce((t, i) => t + i.largestServedKB, 0)) + ' KB (largest AVIF each)');
