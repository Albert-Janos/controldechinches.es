// Markup of the price calculator (ES/EN) and the travel-fee table. Rendered into the hand-written prices pages by tools/build-prices.mjs
// (tokens {{calculator}} and {{traveltable}}); all behaviour lives in js/landing.js + js/quote.js (single price engine).
import { consumerPrice } from './prices.mjs';

const L = {
  es: {
    eyebrow: 'Calculadora de presupuesto', h2: 'Calcula el precio de tu tratamiento.', intro: 'Elige tu localidad, los dormitorios y el tratamiento. El total incluye IVA y el desplazamiento, y puedes enviarlo por WhatsApp sin registro.',
    town: 'Localidad', townPlaceholder: 'Elige tu localidad…', other: 'Otra localidad (presupuesto individual)', hint: 'El desplazamiento es una tarifa fija por localidad y tratamiento (no por dormitorio).',
    rooms: 'Dormitorios a tratar', less: 'Quitar dormitorio', more: 'Añadir dormitorio', roomS: 'dormitorio', roomP: 'dormitorios', roomsNote: 'El precio del tratamiento químico depende del número de dormitorios; a partir del quinto se suma el importe de cada dormitorio adicional.',
    type: 'Tipo de tratamiento', chem: 'Tratamiento químico', chemD: 'Aplicación dirigida; el precio depende de los dormitorios.', steam: 'Vapor seco independiente', steamD: 'Sin insecticida; el importe final se valora en la visita.', steamFrom: 'desde',
    extras: 'Complementos', optional: '(opcionales)', extrasNote: 'Solo se calculan los complementos compatibles con el tratamiento elegido.',
    steamAdd: 'Vapor seco adicional', steamAddD: 'importe fijo por tratamiento, no por dormitorio', sofa: 'Sofá o sillón', sofaD: 'por unidad', sofaLess: 'Quitar sofá', sofaMore: 'Añadir sofá', ulv: 'Nebulización en frío (ULV)', ulvD: 'precio mínimo · solo si está justificada tras la valoración en el lugar',
    summary: 'Resumen del presupuesto', summaryLabel: 'Resumen del presupuesto orientativo', needTown: 'Elige tu localidad para ver el total con desplazamiento.', customTown: 'Para localidades que no figuran en la lista se prepara un presupuesto individual: el desplazamiento no se da por incluido.',
    total: 'Total (IVA incluido)', totalMin: 'Total (IVA incluido), importe mínimo', subtotal: 'Subtotal sin desplazamiento',
    legal: 'Importes con IVA incluido; el tipo aplicado se indica en la sección de precios. Cada tratamiento se calcula por separado: un tratamiento adicional necesario se presupuesta aparte. Los importes marcados como «desde» son mínimos y se confirman tras la valoración en el lugar.',
    wa: 'Enviar este presupuesto por WhatsApp', waNeed: 'Elige tu localidad para enviar el presupuesto', waNote: 'Se abre WhatsApp con el mensaje preparado; no se envía hasta que lo envíes tú y no supone una reserva.', msg: 'Ver el mensaje que se enviará', noscript: 'La calculadora necesita JavaScript. Sin él, consulta las tarifas de esta página o escríbenos por WhatsApp.',
    ttCaption: 'Gastos de desplazamiento por localidad', ttH: 'Gastos de desplazamiento por localidad', ttTown: 'Localidad', ttFee: 'Desplazamiento (IVA incluido)', ttFree: '0 € (sin coste)', ttNote: 'Tarifa fija por tratamiento, no por dormitorio. Si tu localidad no figura en la lista, te preparo un presupuesto individual.',
  },
  en: {
    eyebrow: 'Quote calculator', h2: 'Work out the price of your treatment.', intro: 'Choose your town, the bedrooms and the treatment. The total includes VAT and travel, and you can send it on WhatsApp without registering.',
    town: 'Town', townPlaceholder: 'Choose your town…', other: 'Other town (individual quote)', hint: 'Travel is a fixed fee per town and per treatment (not per bedroom).',
    rooms: 'Bedrooms to treat', less: 'Remove bedroom', more: 'Add bedroom', roomS: 'bedroom', roomP: 'bedrooms', roomsNote: 'The chemical treatment price depends on the number of bedrooms; from the fifth bedroom each additional bedroom is added.',
    type: 'Type of treatment', chem: 'Chemical treatment', chemD: 'Targeted application; the price depends on the bedrooms.', steam: 'Stand-alone dry steam', steamD: 'No insecticide; the final amount is assessed on site.', steamFrom: 'from',
    extras: 'Add-ons', optional: '(optional)', extrasNote: 'Only add-ons compatible with the chosen treatment are calculated.',
    steamAdd: 'Additional dry steam', steamAddD: 'flat fee per treatment, not per bedroom', sofa: 'Sofa or armchair', sofaD: 'each', sofaLess: 'Remove sofa', sofaMore: 'Add sofa', ulv: 'Cold fogging (ULV)', ulvD: 'minimum price · only when justified after the on-site assessment',
    summary: 'Quote summary', summaryLabel: 'Estimated quote summary', needTown: 'Choose your town to see the total including travel.', customTown: 'For towns that are not in the list an individual quote is prepared: travel is not assumed to be included.',
    total: 'Total (VAT included)', totalMin: 'Total (VAT included), minimum amount', subtotal: 'Subtotal before travel',
    legal: 'Amounts include VAT; the rate applied is stated in the price section. Each treatment is calculated separately: any further treatment that turns out to be necessary is quoted separately. Amounts marked “from” are minimums and are confirmed after the on-site assessment.',
    wa: 'Send this quote on WhatsApp', waNeed: 'Choose your town to send the quote', waNote: 'WhatsApp opens with the message ready; nothing is sent until you send it yourself and it is not a booking.', msg: 'See the message that will be sent', noscript: 'The calculator needs JavaScript. Without it, see the rates on this page or message us on WhatsApp.',
    ttCaption: 'Travel costs by town', ttH: 'Travel costs by town', ttTown: 'Town', ttFee: 'Travel (VAT included)', ttFree: '€0 (free)', ttNote: 'Fixed fee per treatment, not per bedroom. If your town is not listed, I will prepare an individual quote.',
  },
};
export const calcStrings = L;
export function travelTable(p, lang) {
  const t = L[lang];
  const rows = p.travel.towns.map(x => `<tr><th scope="row">${x.town}</th><td>${x.net === 0 ? t.ttFree : consumerPrice(p, lang, x.net)}</td></tr>`).join('');
  return `<details class="qc-travel" id="desplazamiento"><summary>${t.ttH}</summary><div class="tariff-frame"><table class="tariff-table qc-travel-table"><caption class="visually-hidden">${t.ttCaption}</caption><thead><tr><th scope="col">${t.ttTown}</th><th scope="col">${t.ttFee}</th></tr></thead><tbody>${rows}</tbody></table></div><p>${t.ttNote}</p></details>`;
}
export function calculator(p, lang) {
  const t = L[lang], g = n => consumerPrice(p, lang, n), from = `${t.steamFrom} `;
  const opts = p.travel.towns.map(x => `<option value="${x.town}">${x.town}</option>`).join('');
  return `<section class="section muted interactive" id="calculadora" data-calculator="" data-qc-lang="${lang}">
  <div class="wrap">
    <div class="section-heading split-heading"><div><p class="eyebrow">${t.eyebrow}</p><h2>${t.h2}</h2></div><p>${t.intro}</p></div>
    <div class="tool-grid">
      <div class="tool-fields qc-fields">
        <fieldset class="qc-group"><legend>1. ${t.town}</legend>
          <label class="visually-hidden" for="qc-town">${t.town}</label>
          <select id="qc-town" data-qc="town"><option value="">${t.townPlaceholder}</option>${opts}<option value="__other__">${t.other}</option></select>
          <p class="qc-hint" data-qc="hint">${t.hint}</p>
        </fieldset>
        <fieldset class="qc-group"><legend>2. ${t.rooms}</legend>
          <div class="qc-stepper"><button type="button" aria-label="${t.less}" data-action="decN">−</button><output aria-live="polite" data-qc="rooms"><span data-value="n">1</span> <span data-value="nLabel">${t.roomS}</span></output><button type="button" aria-label="${t.more}" data-action="incN">+</button></div>
          <p class="qc-hint">${t.roomsNote}</p>
        </fieldset>
        <fieldset class="qc-group"><legend>3. ${t.type}</legend>
          <div class="qc-radios" role="radiogroup" aria-label="${t.type}">
            <label class="qc-radio"><input type="radio" name="qc-type" value="chemical" checked data-qc="type"><span><strong>${t.chem}</strong><small>${t.chemD}</small><em>${t.steamFrom} ${g(p.chemical.bedroomPrices[0])}</em></span></label>
            <label class="qc-radio"><input type="radio" name="qc-type" value="steam" data-qc="type"><span><strong>${t.steam}</strong><small>${t.steamD}</small><em>${from}${g(p.drySteamStandalone.from)}</em></span></label>
          </div>
        </fieldset>
        <fieldset class="qc-group" data-qc="extras"><legend>4. ${t.extras} <span>${t.optional}</span></legend>
          <p class="qc-hint">${t.extrasNote}</p>
          <label class="qc-check"><input type="checkbox" data-qc="steamAddOn"><span><strong>${t.steamAdd} · +${g(p.extras.steamAddOnToChemical.net)}</strong><small>${t.steamAddD}</small></span></label>
          <div class="qc-check qc-sofa"><span><strong>${t.sofa} · +${g(p.extras.sofa.net)}</strong><small>${t.sofaD}</small></span>
            <div class="qc-stepper"><button type="button" aria-label="${t.sofaLess}" data-action="decS">−</button><output aria-live="polite"><span data-value="sofas">0</span></output><button type="button" aria-label="${t.sofaMore}" data-action="incS">+</button></div></div>
          <label class="qc-check"><input type="checkbox" data-qc="ulv"><span><strong>${t.ulv} · ${from}${g(p.extras.coldFoggingFrom.net)}</strong><small>${t.ulvD}</small></span></label>
        </fieldset>
      </div>
      <aside aria-label="${t.summaryLabel}">
        <div><span>${t.summary}</span></div>
        <div data-breakdown="" data-qc="lines" aria-live="polite"></div>
        <div class="qc-total"><span data-value="totalPrefix">${t.total}</span><span data-value="total" aria-live="polite">—</span></div>
        <p data-qc="status"></p>
        <p class="qc-legal">${t.legal}</p>
        <a class="button yellow" href="#calculadora" target="_blank" rel="noopener noreferrer" data-cta="calculator" data-track="quote_whatsapp" data-qc="wa" data-need="${t.waNeed}" data-ready="${t.wa}" aria-disabled="true"><svg class="icon wa" aria-hidden="true"><use href="#icon-wa"/></svg><span>${t.waNeed}</span></a>
        <p class="qc-legal">${t.waNote}</p>
        <details><summary>${t.msg}</summary><pre><span data-value="waText"></span></pre></details>
      </aside>
    </div>
    <noscript><p>${t.noscript}</p></noscript>
  </div>
</section>`;
}
