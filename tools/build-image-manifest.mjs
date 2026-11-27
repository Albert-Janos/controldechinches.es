// Builds data/images.json (the manifest the page generator reads) from
//   docs/seo/IMAGE-ASSET-INVENTORY.csv   (planned assets: ids, alt/caption ES+EN, orientation, role)
//   data/images-processed.json          (written by tools/process-images.mjs for real photos)
// An asset without a processed entry is a PLACEHOLDER (exact aspect ratio, labelled, same id).
// Usage: node tools/build-image-manifest.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv } from './lib/csv.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
export function buildManifest() {
  const inv = parseCsv(readFileSync(join(root, 'docs/seo/IMAGE-ASSET-INVENTORY.csv'), 'utf8'));
  const processed = existsSync(join(root, 'data/images-processed.json')) ? JSON.parse(readFileSync(join(root, 'data/images-processed.json'), 'utf8')) : {};
  const out = {};
  for (const r of inv) {
    if (!/^(IMG|IG)-/.test(r.asset_id)) continue; // existing legacy assets (A-xxx) are not offered to new pages
    const role = r.role, ig = r.asset_id.startsWith('IG-');
    const aspect = ig ? [16, 9] : role === 'document' ? [4, 3] : r.orientation === 'portrait' ? [4, 5] : [3, 2];
    const e = { id: r.asset_id, folder: r.category.replace(/\/$/, ''), role, aspect, priority: r.priority,
      alt: { es: r.alt_es, en: r.alt_en }, caption: { es: r.caption_es, en: r.caption_en },
      seo: (r.optimized_filename || '').replace(/\.webp.*$/, '').replace(/\.svg$/, ''), kind: ig ? 'infographic' : 'photo', status: 'placeholder', variants: null };
    const p = processed[r.asset_id];
    if (p) { e.status = 'ready'; e.variants = p.variants; e.aspect = [p.variants.width, p.variants.height]; if (p.provenance) e.provenance = p.provenance; if (p.scale) e.scale = p.scale; if (p.credit) e.credit = p.credit; if (p.notes) e.notes = p.notes; if (p.alt) e.alt = { ...e.alt, ...p.alt }; if (p.caption) e.caption = { ...e.caption, ...p.caption }; }
    out[r.asset_id] = e;
  }
  return out;
}
if (process.argv[1] && process.argv[1].endsWith('build-image-manifest.mjs')) {
  const m = buildManifest();
  writeFileSync(join(root, 'data/images.json'), JSON.stringify(m, null, 1) + '\n');
  const ready = Object.values(m).filter(x => x.status === 'ready').length;
  console.log(`data/images.json: ${Object.keys(m).length} assets (${ready} ready, ${Object.keys(m).length - ready} placeholders)`);
}
