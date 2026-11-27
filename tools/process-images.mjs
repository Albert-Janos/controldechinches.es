// Reusable image pipeline for large originals (15-30 MB JPG/JPEG/PNG).  Uses sharp.  NEVER writes into the raw folder.
//
//   node tools/process-images.mjs scan                 list new raw files, write 1400px previews (reports/raw/previews), add rows to data/images-assign.csv
//   node tools/process-images.mjs process [--only IMG-ID]   resize + WebP/AVIF + srcset + hero mobile crops; strips ALL metadata (GPS/EXIF/ICC text)
//   node tools/process-images.mjs verify               check outputs: no EXIF/GPS, sizes within budget, files exist
//
// Options: --raw <dir> (default: <repo>/raw-images, or the main checkout's raw-images)  --assign <csv>  --processed <json>
//          --public <dir> (approved output, default assets/img)  --pending <dir> (not approved yet, default _pending-images)
//
// Assignment workflow: `scan` lists files -> a reviewer looks at the previews, fills asset_id (+ alt/caption/credit/scale/notes) and
// sets approved=yes only after the owner confirmed rights/consent and (for macros) the entomological check. Approved images are written
// to assets/img (deployable); everything else goes to _pending-images (git-ignored, never packaged).
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, relative, resolve, extname, basename, dirname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parseCsv, toCsv } from './lib/csv.mjs';
import { slug } from '../templates/components.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const argv = process.argv.slice(2), cmd = argv[0];
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };

function defaultRaw() {
  const local = join(root, 'raw-images');
  const has = d => existsSync(d) && readdirSync(d, { recursive: true }).some(f => /\.(jpe?g|png)$/i.test(f));
  if (has(local)) return local;
  try { const common = execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd: root }).toString().trim(); const main = join(resolve(root, common), '..', 'raw-images'); if (has(main)) return main; } catch { /* not a git checkout */ }
  return local;
}
export const paths = {
  raw: resolve(opt('--raw', process.env.RAW_IMAGES_DIR || defaultRaw())),
  assign: resolve(opt('--assign', join(root, 'data/images-assign.csv'))),
  processed: resolve(opt('--processed', join(root, 'data/images-processed.json'))),
  pub: resolve(opt('--public', join(root, 'assets/img'))),
  pending: resolve(opt('--pending', join(root, '_pending-images'))),
  inventory: resolve(opt('--inventory', join(root, 'docs/seo/IMAGE-ASSET-INVENTORY.csv'))),
  previews: join(root, 'reports/raw/previews'),
};
const ASSIGN_COLS = ['file', 'sha256', 'asset_id', 'approved', 'rights', 'credit', 'location', 'shot_date', 'scale', 'folder', 'role', 'alt_es', 'alt_en', 'caption_es', 'caption_en', 'notes_es', 'notes_en', 'review_note'];

// ---- profiles (see docs/seo/IMAGE-SEO-SPEC.md) ----
export function profileFor(id, role) {
  if (id.startsWith('IMG-ENT')) return { name: 'macro', widths: [800, 1200, 1600, 2400], webp: 86, avif: 62, mobile: false }; // keep identification detail
  if (id.startsWith('IMG-CRED') || role === 'document') return { name: 'document', widths: [800, 1600], webp: 88, avif: 0, mobile: false };
  if (id === 'IMG-ABOUT-02') return { name: 'thumb', widths: [320, 640, 960], webp: 80, avif: 52, mobile: false };
  if (role === 'hero') return { name: 'hero', widths: [640, 960, 1280, 1600, 2000], webp: 76, avif: 50, mobile: true };
  return { name: 'content', widths: [480, 800, 1200, 1600], webp: 76, avif: 50, mobile: false };
}

function walk(dir) { const out = []; if (!existsSync(dir)) return out; for (const n of readdirSync(dir)) { const f = join(dir, n); statSync(f).isDirectory() ? out.push(...walk(f)) : /\.(jpe?g|png)$/i.test(n) && out.push(f); } return out; }
const sha = f => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 16);
const readAssign = () => existsSync(paths.assign) ? parseCsv(readFileSync(paths.assign, 'utf8')) : [];
const writeAssign = rows => { mkdirSync(dirname(paths.assign), { recursive: true }); writeFileSync(paths.assign, toCsv(rows, ASSIGN_COLS)); };
const inside = (child, parent) => { const r = relative(parent, child); return r && !r.startsWith('..') && !resolve(r).startsWith(sep + sep); };

async function scan() {
  const files = walk(paths.raw); mkdirSync(paths.previews, { recursive: true });
  const rows = readAssign(), known = new Set(rows.map(r => r.sha256)); let added = 0; const report = [];
  for (const f of files) {
    const rel = relative(paths.raw, f).split(sep).join('/'), h = sha(f);
    const meta = await sharp(f, { failOn: 'none', limitInputPixels: 800e6 }).metadata();
    const prev = join(paths.previews, `${h}.jpg`);
    if (!existsSync(prev)) await sharp(f, { failOn: 'none', limitInputPixels: 800e6, sequentialRead: true }).rotate().resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 78 }).toFile(prev);
    const isNew = !known.has(h);
    if (isNew) { rows.push(Object.fromEntries(ASSIGN_COLS.map(c => [c, '']))); Object.assign(rows[rows.length - 1], { file: rel, sha256: h, approved: 'no' }); added++; }
    report.push({ file: rel, sha: h, mb: +(statSync(f).size / 1048576).toFixed(1), px: `${meta.width}x${meta.height}`, orientation: meta.orientation || 1, hasExif: !!meta.exif, preview: relative(root, prev).split(sep).join('/'), new: isNew });
  }
  writeAssign(rows);
  console.log(JSON.stringify({ raw: paths.raw, files: files.length, newRows: added, items: report }, null, 1));
}

async function processOne(r, inv) {
  const id = r.asset_id, src = resolve(paths.raw, r.file);
  if (!existsSync(src)) throw new Error('raw file missing: ' + r.file);
  const approved = /^(yes|y|true|1)$/i.test(r.approved);
  const base = inv[id] || {}, role = r.role || base.role || 'content';
  const folder = (r.folder || (base.category || '').replace(/\/$/, '') || 'misc').replace(/^raw-images\//, '');
  const seo = (base.optimized_filename || '').replace(/\.webp.*$/, '') || slug(r.alt_es || id);
  const p = profileFor(id, role), outRoot = approved ? paths.pub : paths.pending;
  const outDir = join(outRoot, folder);
  if (inside(outDir, paths.raw) || resolve(outDir) === paths.raw) throw new Error('refusing to write inside the raw folder');
  mkdirSync(outDir, { recursive: true });
  const inputOpts = { failOn: 'none', limitInputPixels: 800e6, sequentialRead: true };
  const meta = await sharp(src, inputOpts).metadata();
  const oriented = meta.orientation && meta.orientation >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const [sw, sh] = oriented, ratio = sh / sw;
  const widths = p.widths.filter(w => w <= sw); if (!widths.length || (widths.at(-1) < p.widths.at(-1) && sw > widths.at(-1) && !widths.includes(sw))) widths.push(Math.min(sw, p.widths.at(-1)));
  const uniq = [...new Set(widths)].sort((a, b) => a - b);
  // one master at the largest width, then derive (fast for 30 MB files)
  const masterW = uniq.at(-1);
  const master = await sharp(src, inputOpts).rotate().toColorspace('srgb').resize({ width: masterW, withoutEnlargement: true }).toBuffer(); // metadata dropped (sharp default)
  const written = [];
  for (const w of uniq) {
    const img = () => sharp(master).resize({ width: w, withoutEnlargement: true });
    await img().webp({ quality: p.webp, effort: 5 }).toFile(join(outDir, `${seo}-${w}.webp`));
    if (p.avif) await img().avif({ quality: p.avif, effort: 3 }).toFile(join(outDir, `${seo}-${w}.avif`));
    written.push(w);
  }
  let mobile = null;
  if (p.mobile) { // art-direction crop for phones: 4:5, focus on the most salient area
    const mw = [480, 800].filter(w => w <= sw);
    for (const w of mw) { const b = sharp(master).resize({ width: w, height: Math.round(w * 1.25), fit: 'cover', position: sharp.strategy.attention });
      await b.clone().webp({ quality: p.webp, effort: 5 }).toFile(join(outDir, `${seo}-m-${w}.webp`)); await b.clone().avif({ quality: p.avif, effort: 3 }).toFile(join(outDir, `${seo}-m-${w}.avif`)); }
    mobile = { widths: mw, width: mw.at(-1), height: Math.round(mw.at(-1) * 1.25) };
  }
  const dir = (approved ? '/assets/img/' : '/_pending-images/') + folder.split(sep).join('/') + '/';
  const variants = { dir, base: seo, widths: uniq, formats: p.avif ? ['avif', 'webp'] : ['webp'], width: masterW, height: Math.round(masterW * ratio), ...(mobile ? { mobile } : {}) };
  return { id, approved, variants, profile: p.name, sourceMB: +(statSync(src).size / 1048576).toFixed(1), src: r.file };
}

async function processAll() {
  const inv = Object.fromEntries(parseCsv(readFileSync(paths.inventory, 'utf8')).map(r => [r.asset_id, r]));
  const rows = readAssign().filter(r => r.asset_id && (!opt('--only') || r.asset_id === opt('--only')));
  const seen = new Set(); const done = existsSync(paths.processed) ? JSON.parse(readFileSync(paths.processed, 'utf8')) : {};
  const invRows = parseCsv(readFileSync(paths.inventory, 'utf8'));
  for (const r of rows) {
    if (seen.has(r.asset_id)) { console.log(`SKIP duplicate asset_id ${r.asset_id} (${r.file}) - one file per asset id`); continue; } seen.add(r.asset_id);
    if (!r.rights) console.log(`NOTE ${r.asset_id}: rights not recorded - keep approved=no until the owner confirms`);
    const res = await processOne(r, inv);
    if (res.approved) done[r.asset_id] = { variants: res.variants, scale: r.scale || undefined, credit: r.credit || undefined, notes: (r.notes_es || r.notes_en) ? { es: r.notes_es, en: r.notes_en } : undefined, alt: (r.alt_es || r.alt_en) ? { es: r.alt_es, en: r.alt_en } : undefined, caption: (r.caption_es || r.caption_en) ? { es: r.caption_es, en: r.caption_en } : undefined };
    else delete done[r.asset_id];
    const ir = invRows.find(x => x.asset_id === r.asset_id);
    if (ir) { Object.assign(ir, { original_filename: basename(r.file), optimized_filename: `${res.variants.base}-{${res.variants.widths.join(',')}}.${res.variants.formats.join('|')}`, optimized_res: `${res.variants.width}x${res.variants.height}`, optimization_status: `optimized (${res.profile}); EXIF/GPS removed`, privacy_status: 'metadata stripped', usage_rights: r.rights || ir.usage_rights, owner_approval: res.approved ? 'approved' : 'pending', status: res.approved ? 'READY' : 'PROCESSED - awaiting owner approval' }); }
    console.log(`${res.approved ? 'PUBLIC ' : 'PENDING'} ${r.asset_id}  ${res.sourceMB} MB -> ${res.variants.widths.join('/')} px ${res.variants.formats.join('+')}  (${res.profile})`);
  }
  writeFileSync(paths.processed, JSON.stringify(done, null, 1) + '\n');
  if (invRows.length) writeFileSync(paths.inventory, toCsv(invRows, Object.keys(invRows[0])));
}

async function verify() {
  const done = existsSync(paths.processed) ? JSON.parse(readFileSync(paths.processed, 'utf8')) : {}; let bad = 0, n = 0;
  for (const [id, d] of Object.entries(done)) {
    const v = d.variants;
    for (const w of v.widths) for (const f of v.formats) {
      const f2 = join(paths.pub, v.dir.replace(/^\/assets\/img\//, ''), `${v.base}-${w}.${f}`);
      if (!existsSync(f2)) { console.log('MISSING', id, f2); bad++; continue; }
      const m = await sharp(f2).metadata(); n++;
      if (m.exif || m.xmp || m.iptc) { console.log('METADATA PRESENT', id, f2); bad++; }
      if (statSync(f2).size > (v.widths.at(-1) >= 1600 ? 700 : 350) * 1024 && w < 2400) console.log(`WARN large file ${id} ${w}px ${(statSync(f2).size / 1024) | 0} KB`);
    }
  }
  console.log(`verified ${n} files, ${bad} problems`); process.exit(bad ? 1 : 0);
}

const main = { scan, process: processAll, verify }[cmd];
if (!main) { console.log('usage: node tools/process-images.mjs scan|process|verify  [--raw dir] [--only IMG-ID]'); process.exit(cmd ? 1 : 0); }
await main();
