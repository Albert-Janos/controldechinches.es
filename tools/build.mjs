// Static page generator.  Reads data/ + templates/, writes ONLY generated pages (never touches the protected live pages).
//   node tools/build.mjs --mode preview    --out dist-preview     # all statuses, noindex, DRAFT banner
//   node tools/build.mjs --mode production --out dist-pages       # only Approved for indexing / Published
//   add  --pages <dir>  to build extra page JSON (e.g. tests/fixtures/pages); repeatable
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from '../templates/templates.mjs';
import { ui } from '../templates/ui.mjs';
import { infographics } from '../templates/infographics.mjs';
import { buildManifest } from './build-image-manifest.mjs';

export const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const readJson = p => JSON.parse(readFileSync(join(root, p), 'utf8'));

export function loadPages(dirs) {
  const pages = {};
  for (const d of dirs) {
    const abs = join(root, d); if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs).filter(n => n.endsWith('.json'))) {
      const p = JSON.parse(readFileSync(join(abs, f), 'utf8'));
      if (pages[p.id]) throw new Error(`duplicate page id ${p.id} (${f})`);
      p._file = `${d}/${f}`; pages[p.id] = p;
    }
  }
  return pages;
}
export function makeContext({ mode, pageDirs }) {
  const site = readJson('data/site.json'), prices = readJson('data/prices.json'), whatsapp = readJson('data/whatsapp.json');
  const images = buildManifest(), pages = loadPages(pageDirs);
  const included = new Set(Object.values(pages).filter(p => mode === 'preview' || site.indexableStatuses.includes(p.status)).map(p => p.id));
  return { site, prices, whatsapp, images, pages, included, mode, infographics };
}
export function build({ mode = 'preview', out = 'dist-preview', pageDirs = ['data/pages'], clean = true } = {}) {
  const base = makeContext({ mode, pageDirs });
  const outAbs = join(root, out);
  if (clean && existsSync(outAbs)) rmSync(outAbs, { recursive: true, force: true });
  const built = [];
  mkdirSync(outAbs, { recursive: true });
  for (const id of base.included) {
    const page = base.pages[id];
    for (const lang of ['es', 'en']) {
      if (!page[lang]) continue;
      const html = renderPage({ ...base, page, lang, ui: ui[lang] });
      const file = join(outAbs, page[lang].url, 'index.html');
      mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html);
      built.push({ id, lang, url: page[lang].url, status: page.status, file: out + page[lang].url + 'index.html', template: page.template });
    }
  }
  writeFileSync(join(outAbs, 'build-manifest.json'), JSON.stringify({ mode, built }, null, 1));
  return { built, ctx: base };
}
// sitemap: existing live URLs (from the protected sitemap.xml, passed through unchanged) + generated approved pages
export function sitemapXml(ctx, built) {
  const live = readFileSync(join(root, 'sitemap.xml'), 'utf8').replace(/\r\n/g, '\n');
  const entries = built.filter(b => ctx.site.indexableStatuses.includes(b.status));
  if (!entries.length) return live;
  const D = ctx.site.domain;
  const blocks = entries.map(b => {
    const p = ctx.pages[b.id], date = p.dates?.modified;
    const alt = ['es', 'en'].filter(l => p[l]).map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${D}${p[l].url}" />`);
    if (p.es && p.en) alt.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${D}${p.es.url}" />`);
    return `  <url>\n    <loc>${D}${b.url}</loc>\n${date ? `    <lastmod>${date}</lastmod>\n` : ''}${p.es && p.en ? alt.join('\n') + '\n' : ''}  </url>`;
  });
  return live.replace('</urlset>', blocks.join('\n') + '\n</urlset>');
}
if (process.argv[1] && process.argv[1].endsWith('build.mjs')) {
  const a = process.argv.slice(2), get = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  const dirs = a.flatMap((x, i) => x === '--pages' ? [a[i + 1]] : []);
  const r = build({ mode: get('--mode') || 'preview', out: get('--out') || 'dist-preview', pageDirs: dirs.length ? ['data/pages', ...dirs] : ['data/pages'] });
  console.log(`built ${r.built.length} page files (${r.ctx.mode}) -> ${get('--out') || 'dist-preview'}`);
}
