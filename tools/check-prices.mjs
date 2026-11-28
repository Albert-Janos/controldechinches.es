// Read-only consistency check: data/prices.json vs. every public HTML page and js/prices.js.
// Usage: node tools/check-prices.mjs   (exit 1 on any mismatch)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pricesJs, renderStaticPages } from './build-prices.mjs';
import { consumerNumber, consumerPrice, netPrices } from '../templates/prices.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const p = JSON.parse(readFileSync(join(root, 'data/prices.json'), 'utf8'));
const errors = [];
const err = m => errors.push(m);

// 1) generated JS is up to date (READ-ONLY: rendered in memory and compared, line endings ignored; nothing is written)
const onDisk = readFileSync(join(root, 'js/prices.js'), 'utf8').split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
if (onDisk !== pricesJs(p)) err('js/prices.js is out of date - run: node tools/build-prices.mjs');

// 1b) hand-written pages equal the render of templates/static (tokens -> current prices)
for (const [rel, html] of Object.entries(renderStaticPages(p))) {
  const disk = readFileSync(join(root, rel), 'utf8').split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
  if (disk !== html) err(rel + ': out of date with templates/static - run: node tools/build-prices.mjs');
}

// 2) public HTML pages
const skip = new Set(['.git', 'templates', 'docs', 'tools', 'data', 'raw-images', 'node_modules', 'reports', '.claude', 'tests']);
const pages = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (skip.has(n) || n.startsWith('dist') || n.startsWith('_pending')) continue;
    const f = join(d, n);
    statSync(f).isDirectory() ? walk(f) : n.endsWith('.html') && pages.push(f);
  }
})(root);

const retired = /Esencial|Completo|(?:239|289|339|399)\s?€|€\s?(?:239|289|339|399)/;
const c = p.chemical.bedroomPrices;
const gp = (lang, key) => consumerPrice(p, lang, netPrices(p)[key]);
const requireOn = {
  'precios.html': [gp('es', 'chem1'), gp('es', 'chem2'), gp('es', 'chem3'), gp('es', 'chem4'), '+' + gp('es', 'chemExtra'), gp('es', 'steam'), 'Desde ' + gp('es', 'chem1')],
  'en/prices.html': [gp('en', 'chem1'), gp('en', 'chem2'), gp('en', 'chem3'), gp('en', 'chem4'), '+' + gp('en', 'chemExtra'), gp('en', 'steam'), 'From ' + gp('en', 'chem1')],
  'index.html': ['Desde <strong>' + gp('es', 'chem1'), 'Desde <strong>' + gp('es', 'steam')],
  'en/index.html': ['From <strong>' + gp('en', 'chem1'), 'From <strong>' + gp('en', 'steam')],
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
      if (![consumerNumber(p, c[0]), consumerNumber(p, p.drySteamStandalone.from)].includes(min)) err(`${rel}: JSON-LD offer minPrice ${min} is not a gross price from prices.json`);
    }
  }
}
// price pages must carry offers
for (const rel of ['index.html', 'en/index.html', 'precios.html', 'en/prices.html'])
  if (!readFileSync(join(root, rel), 'utf8').includes('"offers"')) err(`${rel}: JSON-LD offers missing`);

if (errors.length) { console.error('PRICE CHECK FAILED\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`price check OK (${pages.length} pages scanned; chemical ${c.join('/')} +${p.chemical.additionalBedroom}; steam from ${p.drySteamStandalone.from})`);
