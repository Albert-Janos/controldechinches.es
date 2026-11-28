import { prices } from './prices.js?v=2';
import { quote, quoteStrings, lineAmount, totalText, fmt } from './quote.js?v=1';
import { track, bindDeclarativeTracking } from './track.js?v=1';

const english = document.documentElement.lang === 'en';
const wa = message => 'https://wa.me/' + prices.whatsapp + '?text=' + encodeURIComponent(message);
const bedroom = n => english ? (n === 1 ? 'bedroom' : 'bedrooms') : (n === 1 ? 'dormitorio' : 'dormitorios');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function setValues(root, values) {
  for (const element of root.querySelectorAll('[data-value]')) {
    const key = element.dataset.value;
    if (Object.hasOwn(values, key)) element.textContent = values[key];
  }
}

function setupRadioKeys(group) {
  if (!group) return;
  const buttons = [...group.querySelectorAll('[role="radio"]')];
  group.addEventListener('keydown', event => {
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    const next = {
      Home: 0,
      End: buttons.length - 1,
      ArrowLeft: (index - 1 + buttons.length) % buttons.length,
      ArrowUp: (index - 1 + buttons.length) % buttons.length,
      ArrowRight: (index + 1) % buttons.length,
      ArrowDown: (index + 1) % buttons.length,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    buttons[next].click();
    buttons[next].focus();
  });
}

function setupCalculator(panel) {
  const lang = english ? 'en' : 'es';
  const state = { town: '', bedrooms: 1, treatment: 'chemical', steamAddOn: false, sofas: 0, ulv: false };
  const table = document.querySelector('.tariff-table[data-rows], .tariff-table:not(.qc-travel-table)');
  const qs = k => panel.querySelector('[data-qc="' + k + '"]');
  const wa = qs('wa'), linesBox = qs('lines'), townSel = qs('town'), extras = qs('extras');
  const status = panel.querySelector('[data-qc="status"]'), tr = quoteStrings[lang];
  let used = false, completed = false;

  function update() {
    const steamOnly = state.treatment === 'steam';
    if (steamOnly) { state.steamAddOn = false; state.sofas = 0; state.ulv = false; }
    const q = quote(prices, state, lang);
    const rows = q.lines.map(l => [l.label + (l.detail ? ' (' + l.detail + ')' : ''), lineAmount(lang, l)]);
    linesBox.replaceChildren(...rows.map(([label, amount]) => {
      const row = document.createElement('div');
      const a = document.createElement('span'), b = document.createElement('span');
      a.textContent = label; b.textContent = amount; row.append(a, b); return row;
    }));
    const needTown = q.status === 'needTown', custom = q.status === 'customTown';
    const totalLabel = q.status === 'ok' ? (q.minimum ? (english ? 'Total (VAT included), minimum amount' : 'Total (IVA incluido), importe mínimo') : tr.total) : tr.subtotal;
    setValues(panel, {
      n: state.bedrooms, nLabel: bedroom(state.bedrooms), sofas: state.sofas,
      totalPrefix: totalLabel,
      total: q.status === 'ok' ? totalText(lang, q) : (q.minimum ? tr.from + ' ' : '') + fmt(lang, q.subtotalCents),
      waText: q.message,
    });
    status.textContent = needTown ? tr.needTown : custom ? (english ? 'Individual quote: travel is not assumed to be included for towns outside the list.' : 'Presupuesto individual: para localidades fuera de la lista no se da por incluido el desplazamiento.') : '';
    const free = q.lines.find(l => l.key === 'travel')?.free;
    qs('hint').textContent = free ? (english ? 'Travel to this town is free (€0).' : 'El desplazamiento a esta localidad no tiene coste (0 €).') : townSel.dataset.hint || qs('hint').textContent;
    wa.href = q.url;
    wa.setAttribute('aria-disabled', String(q.status !== 'ok' && q.status !== 'customTown'));
    wa.querySelector('span').textContent = q.status === 'ok' || custom ? wa.dataset.ready : wa.dataset.need;
    if (needTown) wa.removeAttribute('href');
    extras.querySelectorAll('input').forEach(i => { i.disabled = steamOnly; if (steamOnly) i.checked = false; });
    extras.querySelectorAll('[data-action]').forEach(btn => btn.setAttribute('aria-disabled', String(steamOnly || (btn.dataset.action === 'decS' ? state.sofas === 0 : state.sofas === prices.sofaMax))));
    extras.hidden = false; extras.classList.toggle('is-off', steamOnly);
    for (const [action, atLimit] of Object.entries({ decN: state.bedrooms === 1, incN: state.bedrooms === prices.chemical.maxBedrooms })) panel.querySelector('[data-action="' + action + '"]').setAttribute('aria-disabled', String(atLimit));
    if (table) for (const row of table.querySelectorAll('[data-row]')) row.classList.toggle('is-selected', !steamOnly && Number(row.dataset.row) === Math.min(state.bedrooms, 5));
    if (q.status === 'ok' && !completed && used) { completed = true; track('calculator_complete'); }
  }
  const touch = () => { if (!used) { used = true; track('calculator_use'); } };
  const clamp2 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const actions = {
    incN: () => { state.bedrooms = clamp2(state.bedrooms + 1, 1, prices.chemical.maxBedrooms); },
    decN: () => { state.bedrooms = clamp2(state.bedrooms - 1, 1, prices.chemical.maxBedrooms); },
    incS: () => { state.sofas = clamp2(state.sofas + 1, 0, prices.sofaMax); },
    decS: () => { state.sofas = clamp2(state.sofas - 1, 0, prices.sofaMax); },
  };
  panel.addEventListener('click', event => {
    const control = event.target.closest('button[data-action]');
    if (control && actions[control.dataset.action]) {
      if (control.getAttribute('aria-disabled') === 'true') return;
      touch(); actions[control.dataset.action](); update();
    }
  });
  panel.addEventListener('change', event => {
    const el = event.target, k = el.dataset.qc; if (!k) return;
    touch();
    if (k === 'town') state.town = el.value;
    if (k === 'type') state.treatment = el.value;
    if (k === 'steamAddOn') state.steamAddOn = el.checked;
    if (k === 'ulv') state.ulv = el.checked;
    update();
  });
  wa.addEventListener('click', event => {
    if (wa.getAttribute('aria-disabled') === 'true') { event.preventDefault(); townSel.focus(); return; }
    track('quote_whatsapp_start');
  });
  if (table) table.addEventListener('click', event => {
    const row = event.target.closest('[data-row]');
    if (!row) return;
    touch(); state.treatment = 'chemical'; panel.querySelector('input[name="qc-type"][value="chemical"]').checked = true;
    state.bedrooms = clamp2(Number(row.dataset.row), 1, prices.chemical.maxBedrooms);
    update(); panel.scrollIntoView();
  });
  townSel.dataset.hint = qs('hint').textContent;
  update();
}

function setupBrief(panel) {
  const city = panel.querySelector('[data-field="loc"]');
  const checkIn = panel.querySelector('[data-field="checkin"]');
  const options = [...panel.querySelectorAll('[data-action*="-"]')];
  const links = [...document.querySelectorAll('a[data-dynamic-wa]')];
  const state = { units: 1, tipos: '', cuandos: '', contactos: '' };

  function update() {
    const rawDate = checkIn.value;
    const checkedDate = rawDate && new Intl.DateTimeFormat(english ? 'en-GB' : 'es-ES', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(rawDate + 'T00:00:00Z'));
    const heading = english
      ? 'Hello, I manage tourist accommodation and would like a quote for bed bug treatment.'
      : 'Hola, gestiono un alojamiento turístico y quisiera pedir presupuesto para un tratamiento de chinches de cama.';
    const fields = english
      ? ['Town', 'Accommodation type', 'Affected rooms or units', 'When we first noticed signs', 'Next check-in', 'Preferred contact method']
      : ['Localidad', 'Tipo de alojamiento', 'Habitaciones o unidades afectadas', 'Cuándo se detectaron los indicios', 'Próximo check-in', 'Medio de contacto preferido'];
    const values = [city.value.trim(), state.tipos, state.units, state.cuandos, checkedDate, state.contactos];
    const message = [heading, '', ...values.flatMap((value, i) => value ? [fields[i] + ': ' + value] : [])].join('\n');
    setValues(panel, { unidades: state.units, msg: message });
    for (const link of links) link.href = wa(message);
    for (const option of options) {
      const key = option.dataset.action.split('-')[0];
      const selected = option.textContent.trim() === state[key];
      option.setAttribute(key === 'tipos' ? 'aria-checked' : 'aria-pressed', selected);
      if (key === 'tipos') option.tabIndex = selected || (!state.tipos && option === options[0]) ? 0 : -1;
    }
    panel.querySelector('[data-action="decU"]').setAttribute('aria-disabled', state.units === 1);
    panel.querySelector('[data-action="incU"]').setAttribute('aria-disabled', state.units === 50);
  }

  panel.addEventListener('input', update);
  panel.addEventListener('change', update);
  panel.addEventListener('click', event => {
    const control = event.target.closest('button[data-action]');
    if (!control || control.getAttribute('aria-disabled') === 'true') return;
    const action = control.dataset.action;
    if (action === 'decU' || action === 'incU') {
      state.units = clamp(state.units + (action === 'incU' ? 1 : -1), 1, 50);
    } else {
      const key = action.split('-')[0];
      const value = control.textContent.trim();
      state[key] = key !== 'tipos' && state[key] === value ? '' : value;
    }
    update();
  });

  setupRadioKeys(panel.querySelector('[role="radiogroup"]'));
  update();
}

bindDeclarativeTracking();
const calculator = document.querySelector('[data-calculator]');
if (calculator) setupCalculator(calculator);
const brief = document.querySelector('[data-brief]');
if (brief) setupBrief(brief);
