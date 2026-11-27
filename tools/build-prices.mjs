// Generates js/prices.js from data/prices.json (single source of truth for prices).
// Usage: node tools/build-prices.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(readFileSync(join(root, 'data/prices.json'), 'utf8'));

const must = (cond, msg) => { if (!cond) { console.error('prices.json invalid: ' + msg); process.exit(1); } };
must(p.chemical?.status === 'approved' && p.chemical.bedroomPrices?.length === 4, 'chemical prices');
must(p.chemical.bedroomPrices.every(Number.isFinite) && Number.isFinite(p.chemical.additionalBedroom), 'chemical numbers');
must(p.drySteamStandalone?.status === 'approved' && Number.isFinite(p.drySteamStandalone.from), 'dry steam');

const a = p.addons;
const out = {
  chemical: {
    base: p.chemical.bedroomPrices,
    extra: p.chemical.additionalBedroom,
    maxBedrooms: p.chemical.maxBedroomsInCalculator,
  },
  drySteamFrom: p.drySteamStandalone.from,
  addons: {
    steamPerBedroom: a.steamPerBedroom.enabled ? a.steamPerBedroom.amount : 0,
    sofaEach: a.sofaEach.enabled ? a.sofaEach.amount : 0,
    sofaMax: a.sofaEach.max,
    ulvFrom: a.ulvFrom.enabled ? a.ulvFrom.amount : 0,
  },
};
const js = '// GENERATED from data/prices.json by tools/build-prices.mjs. Do not edit by hand.\n' +
  'export const prices = Object.freeze(' + JSON.stringify(out, null, 2) + ');\n';
writeFileSync(join(root, 'js/prices.js'), js);
console.log('js/prices.js written');
