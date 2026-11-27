// Internal developer page index (LOCAL PREVIEW ONLY). Lists every generated page, its language versions, status, blockers,
// placeholders/TODO counts and link-graph numbers. Written to <preview>/__dev/index.html. The packager refuses it in production.
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function linkGraph(dir) {
  const files = []; (function w(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? w(f) : n === 'index.html' || n.endsWith('.html') ? files.push(f) : null; } })(dir);
  const urlOf = f => '/' + relative(dir, f).split(sep).join('/').replace(/index\.html$/, '');
  const out = new Map(), inn = new Map(), html = new Map();
  for (const f of files) {
    const u = urlOf(f), h = readFileSync(f, 'utf8'); html.set(u, h);
    const targets = new Set();
    for (const m of h.matchAll(/<a\b[^>]*\shref="([^"#?]+)[^"]*"/g)) { const t = m[1].replace('https://www.controldechinches.es', ''); if (t.startsWith('/') && t !== u) targets.add(t); }
    out.set(u, targets);
    for (const t of targets) { if (!inn.has(t)) inn.set(t, new Set()); inn.get(t).add(u); }
  }
  return { out, inn, html };
}

export function writeDevIndex({ outAbs, ctx, built }) {
  const g = linkGraph(outAbs);
  const live = [['/', 'Home ES'], ['/en/', 'Home EN'], ['/precios.html', 'Precios'], ['/en/prices.html', 'Prices'], ['/chinches-apartamentos-turisticos/', 'Alojamientos'], ['/en/bed-bugs-holiday-rentals/', 'Holiday rentals']];
  const pages = Object.values(ctx.pages).sort((a, b) => a.id.localeCompare(b.id));
  const cnt = (h, re) => (h?.match(re) || []).length;
  const statusClass = s => ({ Draft: 'd', 'Approved for indexing': 'ok', Published: 'ok' }[s] || 'w');
  const rows = pages.map(p => {
    const langs = ['es', 'en'].map(l => {
      if (!p[l]) return `<td class="miss">missing</td>`;
      const h = g.html.get(p[l].url);
      return `<td><a href="${p[l].url}">${esc(p[l].url)}</a><br><small>${esc(p[l].h1)}</small><br><small>${cnt(h, /class="sx-ph/g)} placeholders · ${cnt(h, /data-owner-todo/g)} owner TODO · in ${g.inn.get(p[l].url)?.size || 0} / out ${g.out.get(p[l].url)?.size || 0} links</small></td>`;
    }).join('');
    return `<tr><td><strong>${esc(p.id)}</strong>${p.id.startsWith('FX-') ? '<br><small>test fixture</small>' : ''}</td><td>${esc(p.template)}</td><td class="${statusClass(p.status)}">${esc(p.status)}</td>${langs}<td><small>${esc((p._blocked || []).join(' · ') || '—')}</small></td></tr>`;
  }).join('\n');
  const liveRows = live.map(([u, n]) => `<li><a href="${u}">${esc(u)}</a> — ${esc(n)} <small>(live page, protected)</small></li>`).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>DEV page index (local only)</title>
<style>body{font:15px/1.45 system-ui,sans-serif;margin:0;padding:1.5rem;color:#1c2530}h1{margin:.2rem 0}table{border-collapse:collapse;width:100%;margin-top:1rem}th,td{border:1px solid #d9dcd9;padding:.5rem .6rem;text-align:left;vertical-align:top}th{background:#f7f5ef}small{color:#475767}.d{background:#fff3cd}.ok{background:#d9f2d9}.w{background:#e1ecff}.miss{background:#f8d7da}a{color:#1467ba}.warn{background:#fff3cd;border:1px solid #d9a800;padding:.6rem 1rem;border-radius:.4rem}</style></head><body>
<h1>Developer page index</h1><p class="warn"><strong>Local development only.</strong> Not part of the public package (dist/). Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC. ${pages.length} page definitions, ${built.length} language files.</p>
<h2>Generated SEO pages</h2><table><thead><tr><th>ID</th><th>Template</th><th>Status</th><th>ES</th><th>EN</th><th>Blocked by</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Live pages (protected)</h2><ul>${liveRows}</ul>
<h2>Documents</h2><p><a href="/__dev/links.json">Link graph (JSON)</a></p></body></html>`;
  mkdirSync(join(outAbs, '__dev'), { recursive: true });
  writeFileSync(join(outAbs, '__dev/index.html'), html);
  writeFileSync(join(outAbs, '__dev/links.json'), JSON.stringify(Object.fromEntries([...g.out].map(([u, t]) => [u, { out: [...t], in: [...(g.inn.get(u) || [])] }])), null, 1));
}
