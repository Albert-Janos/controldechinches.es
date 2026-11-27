// Read-only consistency check: data/prices.json vs. every public HTML page and js/prices.js.
// Usage: node tools/check-prices.mjs   (exit 1 on any mismatch)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const p = JSON.parse(readFileSync(join(root, 'data/prices.json'), 'utf8'));
const errors = [];
const err = m => errors.push(m);

// 1) generated JS is up to date
const before = readFileSync(join(root, 'js/prices.js'), 'utf8');
execFileSync(process.execPath, [join(root, 'tools/build-prices.mjs')], { stdio: 'ignore' });
const after = readFileSync(join(root, 'js/prices.js'), 'utf8');
if (before !== after) err('js/prices.js was out of date (regenerated now) - commit the new file');

// 2) public HTML pages
const skip = new Set(['.git', 'docs', 'tools', 'data', 'raw-images', 'node_modules', 'reports', '.claude', 'tests']);
const pages = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (skip.has(n)) continue;
    const f = join(d, n);
    statSync(f).isDirectory() ? walk(f) : n.endsWith('.html') && pages.push(f);
  }
})(root);

const retired = /Esencial|Completo|(?:239|289|339|399)\s?€|€\s?(?:239|289|339|399)/;
const c = p.chemical.bedroomPrices;
const requireOn = {
  'precios.html': ['139 €', '179 €', '219 €', '259 €', '+40 €', '150 €', 'Desde 139 €'],
  'en/prices.html': ['€139', '€179', '€219', '€259', '+€40', '€150', 'From €139'],
  'index.html': ['Desde <strong>139 €', 'Desde <strong>150 €'],
  'en/index.html': ['From <strong>€139', 'From <strong>€150'],
};
for (const f of pages) {
  const rel = relative(root, f).split('\\').join('/');
  const s = readFileSync(f, 'utf8');
  if (retired.test(s)) err(`${rel}: contains a retired plan name or price (Esencial/Completo/239/289/339/399)`);
  for (const need of requireOn[rel] || []) if (!s.includes(need)) err(`${rel}: missing "${need}"`);
  // JSON-LD offers must match
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let j; try { j = JSON.parse(m[1]); } catch (e) { err(`${rel}: invalid JSON-LD (${e.message})`); continue; }
    const nodes = j['@graph'] || [j];
    for (const n of nodes) for (const o of n.offers || []) {
      const min = o.priceSpecification?.minPrice;
      if (![c[0], p.drySteamStandalone.from].includes(min)) err(`${rel}: JSON-LD offer minPrice ${min} not in prices.json`);
    }
  }
}
// price pages must carry offers
for (const rel of ['index.html', 'en/index.html', 'precios.html', 'en/prices.html'])
  if (!readFileSync(join(root, rel), 'utf8').includes('"offers"')) err(`${rel}: JSON-LD offers missing`);

if (errors.length) { console.error('PRICE CHECK FAILED\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`price check OK (${pages.length} pages scanned; chemical ${c.join('/')} +${p.chemical.additionalBedroom}; steam from ${p.drySteamStandalone.from})`);
