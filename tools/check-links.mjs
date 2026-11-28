// Broken-link / asset / anchor check over all public HTML files (local files, no network).
// Usage: node tools/check-links.mjs [--json out.json]
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const skip = new Set(['.git', 'docs', 'tools', 'data', 'raw-images', 'node_modules', 'reports', '.claude', 'tests', '_archive-private']);
const pages = [];
(function walk(d) { for (const n of readdirSync(d)) { if (skip.has(n) || n.startsWith('dist') || n.startsWith('_pending')) continue; const f = join(d, n); statSync(f).isDirectory() ? walk(f) : n.endsWith('.html') && pages.push(f); } })(root);

// URLs of released (indexable) generated pages: they only exist after the build, so a link to them is valid
const generatedUrls = (() => { const site = JSON.parse(readFileSync(join(root, 'data/site.json'), 'utf8')), set = new Set(); const dir = join(root, 'data/pages'); for (const n of readdirSync(dir)) { const p = JSON.parse(readFileSync(join(dir, n), 'utf8')); if (site.indexableStatuses.includes(p.status)) for (const l of ['es', 'en']) if (p[l]) set.add(p[l].url); } return set; })();
const toFile = u => { // root-relative URL path -> file on disk or null
  let p = decodeURIComponent(u.split('#')[0].split('?')[0]);
  let f = join(root, p);
  if (p.endsWith('/')) f = join(f, 'index.html');
  if (existsSync(f) && statSync(f).isFile()) return f;
  if (existsSync(f) && statSync(f).isDirectory() && existsSync(join(f, 'index.html'))) return 'redirect-to-slash:' + join(f, 'index.html');
  if (generatedUrls.has(p)) return 'generated:' + p;
  return null;
};
const idsCache = {};
const ids = f => idsCache[f] ??= new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));

const problems = []; const external = new Set(); let checked = 0;
for (const page of pages) {
  const rel = relative(root, page).split(String.fromCharCode(92)).join('/');
  const src = readFileSync(page, 'utf8');
  const urls = [];
  for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) urls.push(m[1]);
  for (const m of src.matchAll(/\scontent="((?:https?:\/\/|\/)[^"]+)"/g)) urls.push(m[1]);
  for (const m of src.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach(s => urls.push(s.trim().split(/\s+/)[0]));
  for (const m of src.matchAll(/url\(["']?([^"')]+)["']?\)/g)) urls.push(m[1]);
  for (const raw of urls) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(raw) || raw === '' ) continue;
    if (/^https?:\/\//.test(raw)) {
      if (raw.startsWith('https://www.controldechinches.es')) { // own absolute URL: check against local files
        const path = raw.replace('https://www.controldechinches.es', '') || '/';
        checked++; if (!toFile(path)) problems.push(`${rel}: absolute own URL not found locally: ${raw}`);
      } else external.add(raw.split('?')[0]);
      continue;
    }
    if (!/^[#\/]/.test(raw) && !/\.(css|js|webp|jpg|png|svg|ico|avif|html)/.test(raw)) continue; // not a URL (e.g. meta content text)
    checked++;
    if (raw.startsWith('#')) { if (raw.length > 1 && !ids(page).has(raw.slice(1))) problems.push(`${rel}: missing anchor ${raw}`); continue; }
    const target = raw.startsWith('/') ? toFile(raw) : (() => { const f = join(dirname(page), raw.split('#')[0].split('?')[0]); return existsSync(f) ? f : null; })();
    if (!target) { problems.push(`${rel}: broken ${raw}`); continue; }
    if (String(target).startsWith('redirect-to-slash:')) { problems.push(`${rel}: link without trailing slash (301): ${raw}`); continue; }
    const frag = raw.split('#')[1];
    if (frag && target.endsWith('.html') && !ids(target).has(frag)) problems.push(`${rel}: ${raw} -> anchor #${frag} not found in target`);
  }
}
const out = { pages: pages.length, linksChecked: checked, problems, externalHosts: [...new Set([...external].map(u => new URL(u).host))] };
if (process.argv.includes('--json')) writeFileSync(process.argv[process.argv.indexOf('--json') + 1], JSON.stringify(out, null, 2));
console.log(`${pages.length} pages, ${checked} internal references checked, ${problems.length} problems; external hosts: ${out.externalHosts.join(', ') || 'none'}`);
problems.forEach(p => console.log(' - ' + p));
process.exit(problems.length ? 1 : 0);
