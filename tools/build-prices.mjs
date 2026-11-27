// Generates js/prices.js from data/prices.json (single source of truth for prices).
// Usage: node tools/build-prices.mjs          (writes js/prices.js, keeping that file's existing line endings)
// tools/check-prices.mjs imports pricesJs() and only COMPARES - validators never write files.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const readPrices = () => JSON.parse(readFileSync(join(root, 'data/prices.json'), 'utf8'));

const must = (cond, msg) => { if (!cond) { console.error('prices.json invalid: ' + msg); process.exit(1); } };
export function pricesJs(p) {
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
  return '// GENERATED from data/prices.json by tools/build-prices.mjs. Do not edit by hand.\n' +
    'export const prices = Object.freeze(' + JSON.stringify(out, null, 2) + ');\n';
}

if (process.argv[1] && process.argv[1].endsWith('build-prices.mjs')) {
  const file = join(root, 'js/prices.js');
  const crlf = existsSync(file) && readFileSync(file, 'utf8').includes('\r\n');
  const js = pricesJs(readPrices());
  writeFileSync(file, crlf ? js.replace(/\n/g, '\r\n') : js);
  console.log('js/prices.js written');
}
