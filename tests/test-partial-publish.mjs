// Partial-publication test (no real publishing, no files written): for many simulated "published" subsets, render every included page
// in memory and prove that nothing links to a generated page that is NOT in the subset - nav, cards, hub lists, related topics,
// breadcrumbs (HTML + JSON-LD), prose links, author box, language switcher and hreflang.  The checker below is independent of
// templates/components.mjs (own URL index, own regexes) so it can catch a bug in the production gate itself.
// Usage: node tests/test-partial-publish.mjs
import { makeContext } from '../tools/build.mjs';
import { renderPage } from '../templates/templates.mjs';
import { ui } from '../templates/ui.mjs';

let failed = 0; const ok = (c, m) => { if (!c) { failed++; console.log('  FAIL', m); } };
const base = makeContext({ mode: 'production', pageDirs: ['data/pages'] });
const ids = Object.keys(base.pages), D = base.site.domain;
const urlToId = {}; for (const p of Object.values(base.pages)) for (const l of ['es', 'en']) if (p[l]) urlToId[p[l].url] = p.id;

function render(subset) {
  const ctx = makeContext({ mode: 'production', pageDirs: ['data/pages'], simulatePublished: subset });
  const out = [];
  for (const id of ctx.included) for (const lang of ['es', 'en']) if (ctx.pages[id][lang]) out.push({ id, lang, url: ctx.pages[id][lang].url, html: renderPage({ ...ctx, page: ctx.pages[id], lang, ui: ui[lang] }) });
  return out;
}
function refs(html) { // every URL-looking reference to the site, wherever it appears
  const out = [];
  for (const m of html.matchAll(/\s(?:href|src|content)="([^"]+)"/g)) out.push(m[1]);
  for (const m of html.matchAll(/"(?:item|url|@id|contentUrl|mainEntityOfPage)":"([^"]+)"/g)) out.push(m[1]);
  return out.map(u => u.replace(D, '').split('#')[0].split('?')[0]);
}
function check(label, subset) {
  const set = new Set(subset), pages = render(set);
  ok(pages.length === [...set].filter(id => base.pages[id]).reduce((n, id) => n + ['es', 'en'].filter(l => base.pages[id][l]).length, 0), `${label}: built page count`);
  for (const pg of pages) {
    for (const u of refs(pg.html)) { const t = urlToId[u]; if (t && !set.has(t)) ok(false, `${label}: ${pg.url} links to unpublished ${u} (${t})`); }
    // language switcher + hreflang must stay inside the build (ES/EN pair is always built together)
    const alt = [...pg.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2].replace(D, '')]);
    ok(alt.length === 3 && alt.every(([, u]) => urlToId[u] === pg.id), `${label}: ${pg.url} hreflang set is not the ES/EN pair of the same page`);
    const sw = pg.html.match(/class="languages"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
    ok(/hreflang="es" href="[^"]+"/.test(sw) && /hreflang="en" href="[^"]+"/.test(sw), `${label}: ${pg.url} language switcher incomplete`);
    ok(!/data-cta[^>]*>/.test('') && !/wa\.me\/\d+\?text=/.test(pg.html), `${label}: ${pg.url} WhatsApp link with pre-filled text`);
  }
  return pages;
}

// 1) the two audit examples, plus the full and the empty site
let r = check('PG-010 only', ['PG-010']);
ok(!r.some(p => /casos-reales/.test(p.html)), '/servicios/ must not mention /casos-reales/ when PG-073 is unpublished');
r = check('PG-040 only', ['PG-040']);
ok(!r.some(p => /atlas-chinches/.test(p.html)), '/guia-chinches/ must not link /atlas-chinches/ when PG-070 is unpublished');
check('empty', []);
const all = check('all', ids);
ok(all.some(p => p.id === 'PG-010' && /href="\/casos-reales\/"/.test(p.html)), 'with everything published the links DO appear again (PG-010 -> /casos-reales/)');
ok(all.some(p => p.id === 'PG-040' && /href="\/atlas-chinches\/"/.test(p.html)), 'with everything published the links DO appear again (PG-040 -> /atlas-chinches/)');

// 2) every page alone, every page missing from an otherwise complete site, and 40 seeded random subsets
for (const id of ids) check(`only ${id}`, [id]);
for (const id of ids) check(`all but ${id}`, ids.filter(x => x !== id));
let seed = 20261127; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
for (let i = 0; i < 40; i++) check(`random #${i}`, ids.filter(() => rnd() < 0.2 + (i % 5) * 0.15));

// 3) a production build must refuse to emit a dead link even if a template regressed (gate in tools/build.mjs)
console.log(failed ? `\n${failed} FAILED` : `\nPARTIAL PUBLICATION: all subsets clean (${ids.length} pages, ${ids.length * 2 + 40 + 4} simulated site states)`);
process.exit(failed ? 1 : 0);
