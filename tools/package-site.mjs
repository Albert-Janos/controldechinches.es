// Builds the ONLY folder that may ever be uploaded to the hosting (FTP/FTPS/SFTP): an allowlist copy of the public files
// + generated pages. Everything else (docs, tools, data, raw images, tests, .git, .env, drafts) can never get in.
//   node tools/package-site.mjs --mode production --out dist            # approved pages only, real sitemap, live .htaccess
//   node tools/package-site.mjs --mode preview --out dist-preview [--pages tests/fixtures/pages]   # drafts, noindex, no .htaccess
import { readdirSync, statSync, copyFileSync, mkdirSync, existsSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative, dirname, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { build, sitemapXml, root } from './build.mjs';

const PUBLIC_FILES = ['index.html', 'precios.html', '404.html', 'gracias.html', 'aviso-legal.html', 'politica-privacidad.html', 'robots.txt', 'sitemap.xml', '.htaccess'];
const PUBLIC_DIRS = ['assets', 'css', 'img', 'js', 'favicon', 'en', 'chinches-apartamentos-turisticos'];
const SKIP_NAMES = /^(\.DS_Store|Thumbs\.db)$/;
const SKIP_EXT = new Set(['.md', '.csv', '.log', '.map', '.bak', '.orig', '.zip', '.psd', '.xcf', '.env']);
const FORBIDDEN = [/(^|\/)\.git(\/|$)/, /(^|\/)\.env/, /(^|\/)(docs|tools|tests|data|content|templates|raw-images|_archive-private|node_modules|reports)(\/|$)/, /\.(md|csv|log|bak|orig|zip)$/i, /(^|\/)package(-lock)?\.json$/];

export function packageSite({ mode = 'production', out = 'dist', pageDirs = [] } = {}) {
  const outAbs = join(root, out);
  if (existsSync(outAbs)) rmSync(outAbs, { recursive: true, force: true });
  mkdirSync(outAbs, { recursive: true });
  const copy = (src, dst) => { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); };
  const walk = (dirRel) => { const abs = join(root, dirRel); for (const n of readdirSync(abs)) { const rel = join(dirRel, n); if (statSync(join(root, rel)).isDirectory()) walk(rel); else if (!SKIP_NAMES.test(n) && !SKIP_EXT.has(extname(n).toLowerCase())) copy(join(root, rel), join(outAbs, rel)); } };
  for (const f of PUBLIC_FILES) { if (mode === 'preview' && ['.htaccess', 'robots.txt', 'sitemap.xml'].includes(f)) continue; if (existsSync(join(root, f))) copy(join(root, f), join(outAbs, f)); }
  PUBLIC_DIRS.filter(d => existsSync(join(root, d))).forEach(walk);

  // generated pages (build writes into a temp dir, then merged)
  const tmp = out + '.pages-tmp';
  const { built, ctx } = build({ mode, out: tmp, pageDirs: ['data/pages', ...pageDirs] });
  const merge = (dirRel) => { const abs = join(root, dirRel); for (const n of readdirSync(abs)) { const rel = join(dirRel, n); if (statSync(join(root, rel)).isDirectory()) merge(rel); else if (n === 'index.html') { const target = join(outAbs, relative(tmp, rel)); if (existsSync(target)) throw new Error('generated page would overwrite an existing file: ' + target); copy(join(root, rel), target); } } };
  merge(tmp); rmSync(join(root, tmp), { recursive: true, force: true });

  if (mode === 'production') {
    writeFileSync(join(outAbs, 'sitemap.xml'), sitemapXml(ctx, built));
    // production guards
    const bad = built.filter(b => !ctx.site.indexableStatuses.includes(b.status));
    if (bad.length) throw new Error('non-approved page in production build: ' + bad.map(b => b.id).join(','));
  } else {
    writeFileSync(join(outAbs, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  }

  // verify: nothing forbidden, nothing draft-ish in production
  const files = []; (function w(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? w(f) : files.push(f); } })(outAbs);
  const rels = files.map(f => relative(outAbs, f).split(sep).join('/'));
  const problems = [];
  for (const r of rels) if (FORBIDDEN.some(re => re.test(r))) problems.push('forbidden file in package: ' + r);
  if (mode === 'production') for (const f of files) {
    if (!f.endsWith('.html')) continue; const s = readFileSync(f, 'utf8'), r = relative(outAbs, f).split(sep).join('/');
    if (/__fixture__/.test(r)) problems.push('fixture in production: ' + r);
    if (/data-owner-todo|data-image-id="[^"]*"/.test(s) && /sx-ph|data-owner-todo/.test(s)) problems.push('placeholder/TODO left in production page: ' + r);
    if (/class="sx-draft"/.test(s)) problems.push('draft banner in production page: ' + r);
  }
  if (problems.length) { rmSync(outAbs, { recursive: true, force: true }); throw new Error('PACKAGE REFUSED:\n- ' + problems.join('\n- ')); }
  const manifest = rels.sort().map(r => ({ path: r, sha256: createHash('sha256').update(readFileSync(join(outAbs, r))).digest('hex'), bytes: statSync(join(outAbs, r)).size }));
  mkdirSync(join(root, 'reports'), { recursive: true });
  writeFileSync(join(root, 'reports', `package-${mode}-manifest.json`), JSON.stringify({ mode, files: manifest.length, generatedPages: built.length, manifest }, null, 1));
  return { out, files: rels.length, generated: built.length };
}
if (process.argv[1] && process.argv[1].endsWith('package-site.mjs')) {
  const a = process.argv.slice(2), get = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  const mode = get('--mode') || 'production';
  const r = packageSite({ mode, out: get('--out') || (mode === 'production' ? 'dist' : 'dist-preview'), pageDirs: a.flatMap((x, i) => x === '--pages' ? [a[i + 1]] : []) });
  console.log(`packaged ${r.files} files (${r.generated} generated page files) -> ${r.out}`);
}
