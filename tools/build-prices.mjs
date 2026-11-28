// Generates js/prices.js (browser/node config for js/quote.js) from data/prices.json + data/site.json and renders the hand-written
// price pages from templates/static/*.html (tokens -> current prices).  Usage: node tools/build-prices.mjs
// tools/check-prices.mjs imports pricesJs()/renderStaticPages() and only COMPARES - validators never write files.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { consumerPrice, consumerNumber, netPrice, vatLabel, netPrices } from '../templates/prices.mjs';
import { calculator, travelTable } from '../templates/calculator.mjs';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const readPrices = () => JSON.parse(readFileSync(join(root, 'data/prices.json'), 'utf8'));
const readSite = () => JSON.parse(readFileSync(join(root, 'data/site.json'), 'utf8'));
const must = (cond, msg) => { if (!cond) { console.error('prices.json invalid: ' + msg); process.exit(1); } };
export function pricesJs(p, site = readSite()) {
  must(p.chemical?.status === 'approved' && p.chemical.bedroomPrices?.length === 4, 'chemical prices');
  must(p.chemical.bedroomPrices.every(Number.isFinite) && Number.isFinite(p.chemical.additionalBedroom), 'chemical numbers');
  must(p.drySteamStandalone?.status === 'approved' && Number.isFinite(p.drySteamStandalone.from), 'dry steam');
  must(p.travel.towns.length === 18 && p.travel.towns.every(t => Number.isFinite(t.net)), 'travel towns');
  must(p.vat.consumerDisplay === 'gross' && Number.isFinite(p.vat.ratePercent), 'vat');
  const out = {
    vat: { ratePercent: p.vat.ratePercent },
    chemical: { base: p.chemical.bedroomPrices, extra: p.chemical.additionalBedroom, maxBedrooms: p.chemical.maxBedroomsInCalculator },
    steamFrom: p.drySteamStandalone.from, steamAddOn: p.extras.steamAddOnToChemical.net, sofa: p.extras.sofa.net, sofaMax: p.extras.sofa.max, ulvFrom: p.extras.coldFoggingFrom.net,
    travel: { towns: p.travel.towns.map(({ town, net }) => ({ town, net })) },
    whatsapp: site.whatsapp.number,
  };
  return '// GENERATED from data/prices.json + data/site.json by tools/build-prices.mjs. Do not edit by hand.\n' +
    'export const prices = Object.freeze(' + JSON.stringify(out, null, 2) + ');\n';
}
// ---- hand-written (Ads-protected) pages: templates/static/<name>.html  ->  <path>.html  ----
// tokens: {{price:KEY}} {{net:KEY}} {{vat}} {{travel:Town}} (gross fee) {{travelnet:Town}} {{total:chem3+steamAddOn+Benidorm}} (gross sum)
export const STATIC_PAGES = { 'index.html': 'index.html', 'en/index.html': 'en-index.html', 'precios.html': 'precios.html', 'en/prices.html': 'en-prices.html', 'chinches-apartamentos-turisticos/index.html': 'apartamentos.html', 'en/bed-bugs-holiday-rentals/index.html': 'en-apartments.html' };
export function renderStatic(p, rel, tpl) {
  const lang = rel.startsWith('en/') ? 'en' : 'es', nets = netPrices(p);
  const townNet = n => { const t = p.travel.towns.find(x => x.town === n); if (!t) throw new Error('unknown town ' + n); return t.net; };
  const names = p.travel.towns.map(t => t.town);
  return tpl.replace(/{{(price|net|num|travel|travelnet|total|vat|towns|townsli|areajson|calculator|traveltable)(?::([^}]+))?}}/g, (m, k, a) => {
    if (k === 'vat') return vatLabel(p, lang);
    if (k === 'towns') return names.join(', ');
    if (k === 'townsli') return names.map(n => '<li>' + n + '</li>').join('');
    if (k === 'areajson') return JSON.stringify(names);
    if (k === 'calculator') return calculator(p, lang);
    if (k === 'traveltable') return travelTable(p, lang);
    if (k === 'price' || k === 'net' || k === 'num') { if (!(a in nets)) throw new Error('unknown token ' + m); return k === 'price' ? consumerPrice(p, lang, nets[a]) : k === 'net' ? netPrice(lang, nets[a]) : String(consumerNumber(p, nets[a])); }
    if (k === 'travel') return consumerPrice(p, lang, townNet(a));
    if (k === 'travelnet') return netPrice(lang, townNet(a));
    return consumerPrice(p, lang, a.split('+').reduce((sum, part) => sum + (part in nets ? nets[part] : townNet(part)), 0));
  });
}
export function renderStaticPages(p = readPrices()) {
  const out = {};
  for (const [rel, tplName] of Object.entries(STATIC_PAGES)) { const f = join(root, 'templates/static', tplName); if (existsSync(f)) out[rel] = renderStatic(p, rel, readFileSync(f, 'utf8')); }
  return out;
}
if (process.argv[1] && process.argv[1].endsWith('build-prices.mjs')) {
  const file = join(root, 'js/prices.js'), crlf = existsSync(file) && readFileSync(file, 'utf8').includes('\r\n');
  const js = pricesJs(readPrices());
  writeFileSync(file, crlf ? js.replace(/\n/g, '\r\n') : js);
  console.log('js/prices.js written');
  for (const [rel, html] of Object.entries(renderStaticPages())) {
    const f = join(root, rel), crlf2 = existsSync(f) && readFileSync(f, 'utf8').includes('\r\n');
    writeFileSync(f, crlf2 ? html.replace(/\r?\n/g, '\r\n') : html); console.log('rendered ' + rel);
  }
}
