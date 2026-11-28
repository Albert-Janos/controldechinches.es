// THE ONLY PRICE ENGINE (browser + node tests). Pure functions, integer cents only (no floating point).
// Input config = js/prices.js (generated from data/prices.json). Used by: the calculator on the prices pages (ES/EN)
// and the WhatsApp quote message - the message is produced from the same result object, so amounts always match.
const T = {
  es: {
    chemical: 'Tratamiento químico', steamAddOn: 'Vapor seco adicional', steamAlone: 'Vapor seco independiente', sofa: 'Sofás o sillones', ulv: 'Nebulización en frío (ULV)',
    travel: 'Desplazamiento', travelTown: t => `Desplazamiento – ${t}`, free: 'sin coste', from: 'desde', total: 'Total (IVA incluido)', subtotal: 'Subtotal sin desplazamiento (IVA incluido)',
    title: 'Solicitud de tratamiento – Control de Chinches', town: 'Localidad', bedrooms: 'Dormitorios', quote: 'Presupuesto estimado', otherTown: 'otra localidad (no figura en la lista de desplazamientos)',
    otherAsk: 'Solicito un presupuesto individual, incluido el desplazamiento.', ask: 'Hola, me gustaría solicitar una cita para este tratamiento. ¿Qué disponibilidad tiene?',
    needTown: 'Elige tu localidad para ver el total con desplazamiento.',
  },
  en: {
    chemical: 'Chemical treatment', steamAddOn: 'Additional dry steam', steamAlone: 'Stand-alone dry steam', sofa: 'Sofas or armchairs', ulv: 'Cold fogging (ULV)',
    travel: 'Travel', travelTown: t => `Travel – ${t}`, free: 'free', from: 'from', total: 'Total (VAT included)', subtotal: 'Subtotal before travel (VAT included)',
    title: 'Treatment request – Control de Chinches', town: 'Town', bedrooms: 'Bedrooms', quote: 'Estimated quote', otherTown: 'other town (not in the travel-fee list)',
    otherAsk: 'I would like an individual quote, including travel.', ask: 'Hello, I would like to book an appointment for this treatment. What availability do you have?',
    needTown: 'Choose your town to see the total including travel.',
  },
};
export const OTHER_TOWN = '__other__';
// netEur is a whole number of euros -> net * (100 + VAT %) is an exact integer number of cents
export const grossCents = (cfg, netEur) => netEur * (100 + cfg.vat.ratePercent);
export function fmt(lang, cents) {
  const eur = Math.trunc(cents / 100), c = cents % 100, n = String(eur).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.');
  return lang === 'en' ? `€${n}.${String(c).padStart(2, '0')}` : `${n},${String(c).padStart(2, '0')} €`;
}
export const townFeeNet = (cfg, town) => cfg.travel.towns.find(t => t.town === town)?.net ?? null;
export function chemicalNet(cfg, bedrooms) { const b = cfg.chemical.base; return bedrooms <= b.length ? b[bedrooms - 1] : b[b.length - 1] + (bedrooms - b.length) * cfg.chemical.extra; }

// input: { town: '' | <listed town> | OTHER_TOWN, bedrooms: 1..max, treatment: 'chemical'|'steam', steamAddOn: bool, sofas: 0..max, ulv: bool }
export function quote(cfg, input, lang = 'es') {
  const t = T[lang], errors = [], i = { town: '', bedrooms: 1, treatment: 'chemical', steamAddOn: false, sofas: 0, ulv: false, ...input };
  if (!Number.isInteger(i.bedrooms) || i.bedrooms < 1 || i.bedrooms > cfg.chemical.maxBedrooms) errors.push('bedrooms');
  if (!['chemical', 'steam'].includes(i.treatment)) errors.push('treatment');
  if (!Number.isInteger(i.sofas) || i.sofas < 0 || i.sofas > cfg.sofaMax) errors.push('sofas');
  if (i.town && i.town !== OTHER_TOWN && townFeeNet(cfg, i.town) === null) errors.push('town');
  // stand-alone dry steam never adds the chemical-treatment extras (no second steam add-on, no ULV, no sofa add-on)
  if (i.treatment === 'steam' && (i.steamAddOn || i.sofas > 0 || i.ulv)) errors.push('combination');
  if (errors.length) return { ok: false, errors, lines: [], totalCents: null, minimum: false, status: 'invalid', input: i };
  const lines = [], g = n => grossCents(cfg, n);
  if (i.treatment === 'chemical') lines.push({ key: 'chemical', label: t.chemical, cents: g(chemicalNet(cfg, i.bedrooms)), minimum: false });
  else lines.push({ key: 'steamAlone', label: t.steamAlone, cents: g(cfg.steamFrom), minimum: true });
  if (i.steamAddOn) lines.push({ key: 'steamAddOn', label: t.steamAddOn, cents: g(cfg.steamAddOn), minimum: false });
  if (i.sofas) lines.push({ key: 'sofa', label: t.sofa, cents: g(cfg.sofa) * i.sofas, minimum: false, detail: `${i.sofas} × ${fmt(lang, g(cfg.sofa))}` });
  if (i.ulv) lines.push({ key: 'ulv', label: t.ulv, cents: g(cfg.ulvFrom), minimum: true });
  const subtotalCents = lines.reduce((s, l) => s + l.cents, 0);
  let status = 'ok';
  if (!i.town) status = 'needTown';
  else if (i.town === OTHER_TOWN) status = 'customTown';
  else { const net = townFeeNet(cfg, i.town); lines.push({ key: 'travel', label: t.travelTown(i.town), plainLabel: t.travel, cents: g(net), minimum: false, free: net === 0 }); }
  const totalCents = status === 'ok' ? lines.reduce((s, l) => s + l.cents, 0) : null;
  const minimum = lines.some(l => l.minimum);
  const r = { ok: true, errors, status, lines, subtotalCents, totalCents, minimum, input: i };
  r.message = buildMessage(cfg, r, lang);
  r.url = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(r.message)}`;
  return r;
}
export const lineAmount = (lang, l) => (l.free ? `${lang === 'en' ? '€0' : '0 €'} (${T[lang].free})` : (l.minimum ? `${T[lang].from} ` : '') + fmt(lang, l.cents));
export const totalText = (lang, r) => (r.totalCents === null ? null : (r.minimum ? `${T[lang].from} ` : '') + fmt(lang, r.totalCents));
export function buildMessage(cfg, r, lang) {
  const t = T[lang], i = r.input;
  const out = [t.title, '', `${t.town}: ${i.town === OTHER_TOWN ? t.otherTown : i.town || '—'}`, `${t.bedrooms}: ${i.bedrooms}`, '', `${t.quote}:`];
  for (const l of r.lines) out.push(`${l.plainLabel || l.label}: ${lineAmount(lang, l)}${l.detail ? ` (${l.detail})` : ''}`);
  out.push('');
  if (r.status === 'ok') out.push(`${t.total}: ${totalText(lang, r)}`);
  else {
    out.push(`${t.subtotal}: ${(r.minimum ? t.from + ' ' : '') + fmt(lang, r.subtotalCents)}`);
    if (r.status === 'customTown') out.push(t.otherAsk);
  }
  out.push('', t.ask);
  return out.join('\n');
}
export const quoteStrings = T;
