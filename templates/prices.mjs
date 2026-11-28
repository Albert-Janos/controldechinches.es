// Central price logic for generated pages. data/prices.json holds the owner-approved NET prices and the VAT setting; nothing else
// in the templates or page data carries a hand-typed price. Page texts use tokens that are resolved at render time:
//   {{price:KEY}}  consumer price (VAT included while vat.consumerDisplay === 'gross'), e.g. "168,19 €" / "€168.19"
//   {{net:KEY}}    approved net price, e.g. "139 €" / "€139"        {{vat}}  the VAT rate, e.g. "21 %" / "21%"
// KEYs: chem1..chem4 (chemical treatment by bedrooms affected), chemExtra (each additional bedroom), steam (stand-alone dry steam, from),
//       steamAddOn (dry steam added to a chemical treatment), sofa (per sofa), fogging (supplementary cold fogging, from).
export function netPrices(p) {
  const c = p.chemical.bedroomPrices;
  return { chem1: c[0], chem2: c[1], chem3: c[2], chem4: c[3], chemExtra: p.chemical.additionalBedroom, steam: p.drySteamStandalone.from, steamAddOn: p.extras.steamAddOnToChemical.net, sofa: p.extras.sofa.net, fogging: p.extras.coldFoggingFrom.net, ulv: p.extras.coldFoggingFrom.net };
}
// integer cents, no floating point: net (EUR) x (100 + VAT %)
const grossCents = (p, net) => (p.vat.consumerDisplay === 'gross' ? net * (100 + p.vat.ratePercent) : net * 100);
function fmtCents(lang, cents, forceDecimals) {
  const eur = Math.floor(cents / 100), c = cents % 100, dec = forceDecimals || c !== 0;
  const n = lang === 'en' ? `${eur}${dec ? '.' + String(c).padStart(2, '0') : ''}` : `${eur}${dec ? ',' + String(c).padStart(2, '0') : ''}`;
  return lang === 'en' ? '€' + n : n + ' €';
}
export const consumerPrice = (p, lang, net) => (net === 0 ? (lang === 'en' ? '€0' : '0 €') : fmtCents(lang, grossCents(p, net), p.vat.consumerDisplay === 'gross'));
export const townNet = (p, town) => { const t = p.travel.towns.find(x => x.town === town); if (!t) throw new Error('unknown town ' + town); return t.net; };
export const consumerNumber = (p, net) => grossCents(p, net) / 100;
export const netPrice = (lang, net) => fmtCents(lang, net * 100, false);
export const vatLabel = (p, lang) => (lang === 'en' ? `${p.vat.ratePercent}%` : `${p.vat.ratePercent} %`);
// every number a generated page may legitimately show (net, consumer, both decimal styles) - used by the validator
export function allowedNumbers(p) {
  const out = new Set();
  for (const net of [...Object.values(netPrices(p)), ...p.travel.towns.map(t => t.net)]) { out.add(String(net)); const g = grossCents(p, net); out.add(`${Math.floor(g / 100)},${String(g % 100).padStart(2, '0')}`); out.add(`${Math.floor(g / 100)}.${String(g % 100).padStart(2, '0')}`); out.add(String(g / 100)); }
  return out;
}
export function resolveTokens(ctx, html) {
  const nets = netPrices(ctx.prices);
  return html.replace(/\{\{(travel|travelnet):([^}]+)\}\}/g, (m, kind, town) => (kind === 'travel' ? consumerPrice(ctx.prices, ctx.lang, townNet(ctx.prices, town)) : netPrice(ctx.lang, townNet(ctx.prices, town))))
    .replace(/\{\{total:([^}]+)\}\}/g, (m, a) => consumerPrice(ctx.prices, ctx.lang, a.split('+').reduce((sum, part) => sum + (part in nets ? nets[part] : townNet(ctx.prices, part)), 0)))
    .replace(/\{\{(price|net):(\w+)\}\}/g, (m, kind, key) => { if (!(key in nets)) throw new Error(`unknown price token ${m} on ${ctx.page.id}`); return kind === 'price' ? consumerPrice(ctx.prices, ctx.lang, nets[key]) : netPrice(ctx.lang, nets[key]); })
    .replace(/\{\{url:(PG-\w+)\}\}/g, (m, id) => { const u = ctx.pages[id]?.[ctx.lang]?.url; if (!u) throw new Error(`unknown page token ${m} on ${ctx.page.id}`); return u; })
    .replace(/\{\{vat\}\}/g, () => vatLabel(ctx.prices, ctx.lang));
}
