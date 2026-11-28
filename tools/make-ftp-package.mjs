// Builds the clean FTP package: ONLY what the hosting needs (allowlist copy + generated pages), then a ZIP of it.
//   node tools/make-ftp-package.mjs [--out <absolute folder>] [--zip <absolute zip file>]
// Steps: production build (tools/package-site.mjs, refuses drafts/placeholders/forbidden files) -> prune generated image/video files that no
// shipped page references -> copy to the target folder -> validate the folder -> ZIP (forward-slash entries, dotfiles included) ->
// re-extract the ZIP into a temp dir and validate that too -> write a file comparison against the currently live baseline commit.
import { readdirSync, statSync, readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, existsSync, mkdtempSync } from 'node:fs';
import { join, relative, sep, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { packageSite } from './package-site.mjs';
import { root } from './build.mjs';

const a = process.argv.slice(2), get = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const outDir = get('--out', join(root, 'controldechinches-production')), zipFile = get('--zip', outDir.replace(/[\\/]+$/, '') + '.zip');
const LIVE_BASELINE = get('--live', '3c4f9f6'); // the commit that equals the files currently on the live site (verified by hash, 2026-11-28)
const TEMP = 'dist-ftp-build';
const walk = d => { const o = []; for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? o.push(...walk(f)) : o.push(f); } return o; };
const rel = (base, f) => relative(base, f).split(sep).join('/');

// 1) production build
const r = packageSite({ mode: 'production', out: TEMP, pageDirs: [] });
const build = join(root, TEMP);
console.log(`production build: ${r.files} files, ${r.generated} generated page files`);

// 2) prune generated media that no shipped text file references (images of unpublished pages, their video, unused variants)
const textFiles = walk(build).filter(f => /\.(html|css|js|xml|txt|json|webmanifest)$/.test(f));
const corpus = textFiles.map(f => readFileSync(f, 'utf8')).join('\n');
let pruned = 0, prunedBytes = 0;
for (const f of walk(build)) {
  const p = rel(build, f);
  if (!/^assets\/(img|video)\//.test(p)) continue;
  if (corpus.includes(p) || corpus.includes('/' + p)) continue;
  prunedBytes += statSync(f).size; pruned++; rmSync(f);
}
// remove folders emptied by the pruning
(function clean(d) { for (const n of readdirSync(d)) { const f = join(d, n); if (statSync(f).isDirectory()) { clean(f); if (!readdirSync(f).length) rmSync(f, { recursive: true }); } } })(build);
console.log(`pruned ${pruned} unreferenced media files (${(prunedBytes / 1048576).toFixed(1)} MB)`);

// 3) copy to the target folder
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(build, outDir, { recursive: true });
rmSync(build, { recursive: true, force: true });
const files = walk(outDir).map(f => rel(outDir, f)).sort();

// 4) validate the folder (the real production validator, against the real package)
const validate = dir => spawnSync(process.execPath, [join(root, 'tools/validate.mjs'), '--dir', dir, '--mode', 'production'], { cwd: root, encoding: 'utf8' });
const v1 = validate(outDir); const tail = s => s.trim().split('\n').slice(-1)[0];
console.log('validator (folder): ' + tail(v1.stdout)); if (v1.status !== 0) { console.log(v1.stdout); process.exit(1); }

// 5) ZIP: bsdtar (Windows tar.exe) writes zip with forward slashes; entries listed explicitly so dotfiles (.htaccess) are included
const tar = process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'zip';
if (existsSync(zipFile)) rmSync(zipFile);
const tops = readdirSync(outDir).sort();
const z = process.platform === 'win32' ? spawnSync(tar, ['-a', '-c', '-f', zipFile, '-C', outDir, ...tops]) : spawnSync('zip', ['-r', '-q', zipFile, ...tops], { cwd: outDir });
if (z.status !== 0) { console.log(String(z.stderr)); process.exit(1); }
const listing = (process.platform === 'win32' ? spawnSync(tar, ['-tf', zipFile], { encoding: 'utf8', maxBuffer: 64 << 20 }) : spawnSync('unzip', ['-Z1', zipFile], { encoding: 'utf8', maxBuffer: 64 << 20 })).stdout.split(/\r?\n/).filter(Boolean).filter(x => !x.endsWith('/'));
const bad = listing.filter(x => x.includes('\\') || x.startsWith('/') || x.startsWith('./') || x.startsWith('controldechinches-production'));
if (bad.length || listing.length !== files.length || !listing.includes('.htaccess') || !listing.includes('index.html')) { console.log('ZIP structure problem', { entries: listing.length, files: files.length, bad: bad.slice(0, 5) }); process.exit(1); }

// 6) extract the ZIP again and validate the extracted copy (proves the archive itself is good)
const tmp = mkdtempSync(join(tmpdir(), 'cdc-zip-check-'));
if (process.platform === 'win32') spawnSync(tar, ['-x', '-f', zipFile, '-C', tmp]); else spawnSync('unzip', ['-q', zipFile, '-d', tmp]);
const hash = f => createHash('sha256').update(readFileSync(f)).digest('hex');
const mism = files.filter(f => !existsSync(join(tmp, f)) || hash(join(tmp, f)) !== hash(join(outDir, f)));
const v2 = validate(tmp); console.log('validator (extracted ZIP): ' + tail(v2.stdout));
rmSync(tmp, { recursive: true, force: true });
if (mism.length || v2.status !== 0) { console.log('ZIP verification failed', mism.slice(0, 5)); process.exit(1); }

// 7) forbidden content scan
const FORBIDDEN = /(^|\/)(\.git|\.env|node_modules|docs|tools|tests|data|templates|reports|raw-images|uj-kepek|_pending-images|_archive-private)(\/|$)|\.(md|csv|log|bak|orig|zip|map)$|package(-lock)?\.json$|build-manifest/i;
const forb = files.filter(f => FORBIDDEN.test(f)); if (forb.length) { console.log('FORBIDDEN FILES IN PACKAGE', forb); process.exit(1); }
const secrets = files.filter(f => /\.(html|js|css|xml|txt|json)$/.test(f)).filter(f => /(api[_-]?key|secret|password|BEGIN (RSA|PRIVATE)|localhost|127\.0\.0\.1)/i.test(readFileSync(join(outDir, f), 'utf8')) && !/measurement-config|main\.js|landing\.js|prices\.js|seo\.js|menu\.js/.test(f));

// 8) comparison with the live baseline: which package files are new / changed / identical to what is on the server now
const live = new Map(execFileSync('git', ['ls-tree', '-r', LIVE_BASELINE], { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n').filter(Boolean).map(l => { const [meta, p] = l.split('\t'); return [p, meta.split(' ')[2]]; }));
const cmp = { new: [], changed: [], same: [] };
for (const f of files) {
  if (!live.has(f)) { cmp.new.push(f); continue; }
  const baseBuf = execFileSync('git', ['cat-file', 'blob', live.get(f)], { cwd: root, maxBuffer: 64 << 20 }), cur = readFileSync(join(outDir, f));
  const isText = /\.(html|css|js|xml|txt|json|svg)$|(^|\/)\.htaccess$/.test(f), n = b => isText ? b.toString('utf8').replace(/\r\n/g, '\n') : b.toString('latin1');
  (n(baseBuf) === n(cur) ? cmp.same : cmp.changed).push(f);
}
const notInPackage = [...live.keys()].filter(p => !files.includes(p));
const zipBytes = statSync(zipFile).size, total = files.reduce((s, f) => s + statSync(join(outDir, f)).size, 0);
const summary = { folder: outDir, zip: zipFile, zipBytes, files: files.length, totalBytes: total, pruned, new: cmp.new.length, changed: cmp.changed, identicalToLive: cmp.same.length, baselineFilesNotInPackage: notInPackage, secretsScanHits: secrets };
writeFileSync(join(root, 'reports', 'ftp-package-summary.json'), JSON.stringify({ ...summary, newFiles: cmp.new }, null, 1));
console.log(JSON.stringify({ ...summary, new: cmp.new.length }, null, 1));
console.log(`ZIP OK: ${zipFile} (${(zipBytes / 1048576).toFixed(2)} MB, ${listing.length} entries)`);
