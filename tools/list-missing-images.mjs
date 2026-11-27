// Lists every image slot of the generated pages that is still a placeholder (page, section, id, priority, orientation).
//   node tools/list-missing-images.mjs [--json out.json]
import { writeFileSync } from 'node:fs';
import { makeContext } from './build.mjs';
const ctx = makeContext({ mode: 'preview', pageDirs: ['data/pages'] });
const out = [];
for (const p of Object.values(ctx.pages)) {
  const L = p.es; let section = '(oldal teteje / hero)';
  const add = (id, where) => { const e = ctx.images[id]; if (!e || e.status === 'ready') return; out.push({ page: p.id, url: L.url, h1: L.h1, section: where, id, kind: e.kind, role: e.role, priority: e.priority, aspect: e.aspect, alt_es: e.alt?.es }); };
  if (L.heroImage) add(L.heroImage, 'hero');
  for (const b of L.blocks || []) {
    if (b.h2) section = b.h2;
    if (b.type === 'figure') add(b.image, section);
    if (b.type === 'infographic' && !ctx.infographics[b.id]) add(b.id, section);
    if (b.type === 'gallery' || b.type === 'docs') for (const im of [...(b.images || []), ...((b.groups || []).flatMap(g => g.images))]) add(im, b.h2 || section);
  }
}
if (process.argv.includes('--json')) writeFileSync(process.argv[process.argv.indexOf('--json') + 1], JSON.stringify(out, null, 1));
console.log(out.length + ' placeholder slots');
for (const r of out) console.log([r.page, r.section, r.id, r.priority, r.aspect.join(':'), r.kind].join(' | '));
