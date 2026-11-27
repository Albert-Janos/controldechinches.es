const english = document.documentElement.lang === 'en';
const wa = message => 'https://wa.me/34605259206?text=' + encodeURIComponent(message);
const money = amount => english ? '€' + amount : amount + ' €';
const bedroom = n => english ? (n === 1 ? 'bedroom' : 'bedrooms') : (n === 1 ? 'dormitorio' : 'dormitorios');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function setValues(root, values) {
  for (const element of root.querySelectorAll('[data-value]')) {
    const key = element.dataset.value;
    if (Object.hasOwn(values, key)) element.textContent = values[key];
  }
}

function setupRadioKeys(group) {
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
  const rates = {
    esencial: { base: [139, 179, 219, 259], extra: 40, name: english ? 'Esencial plan' : 'Plan Esencial' },
    completo: { base: [239, 289, 339, 399], extra: 50, name: english ? 'Completo plan' : 'Plan Completo' },
  };
  const state = { rooms: 1, plan: 'esencial', steam: false, steamRooms: 1, sofas: 0, ulv: false };
  const plans = [...panel.querySelectorAll('[role="radio"]')];
  const table = document.querySelector('.tariff-table');
  const summary = panel.querySelector('[data-breakdown]');
  const lineTemplate = summary.firstElementChild.cloneNode(true);
  const quoteLinks = [...document.querySelectorAll('a[data-dynamic-wa]')];
  const price = key => rates[key].base[Math.min(state.rooms, 4) - 1] + Math.max(state.rooms - 4, 0) * rates[key].extra;
  const setRooms = n => {
    state.rooms = clamp(n, 1, 10);
    state.steamRooms = Math.min(state.rooms, state.steamRooms);
  };

  function update() {
    const { rooms, plan, steam, steamRooms, sofas, ulv } = state;
    const base = price(plan);
    const steamCost = steam ? 80 * steamRooms : 0;
    const sofaCost = 40 * sofas;
    const total = base + steamCost + sofaCost + (ulv ? 50 : 0);
    const from = english ? 'from ' : 'desde ';
    const summaryLabel = ulv ? (english ? 'Total from' : 'Total desde') : (english ? 'Estimated total' : 'Total orientativo');
    const rows = [[rates[plan].name + ' · ' + rooms + ' ' + bedroom(rooms), money(base)]];
    const sofaLabel = english
      ? (sofas === 1 ? 'additional sofa or armchair' : 'additional sofas or armchairs')
      : (sofas === 1 ? 'sofá o sillón adicional' : 'sofás o sillones adicionales');
    if (steam) rows.push([(english ? 'Dry steam' : 'Vapor seco') + ' · ' + steamRooms + ' ' + bedroom(steamRooms), '+' + money(steamCost)]);
    if (sofas) rows.push([sofas + ' ' + sofaLabel, '+' + money(sofaCost)]);
    if (ulv) rows.push([english ? 'Cold fogging (ULV)' : 'Nebulización en frío (ULV)', from + '+' + money(50)]);
    summary.replaceChildren(...rows.map(([label, amount]) => {
      const entry = lineTemplate.cloneNode(true);
      entry.children[0].textContent = label;
      entry.children[1].textContent = amount;
      return entry;
    }));

    const message = [
      english ? 'Hello, I put together this bed bug treatment estimate on your website:' : 'Hola, he calculado este precio orientativo para un tratamiento de chinches en vuestra web:',
      ...rows.filter((_, i) => !ulv || i < rows.length - 1).map(([label, amount]) => '• ' + label + ' (' + amount + ')'),
      ulv && (english ? '• I’d like to ask about adding cold fogging (ULV), from €50.' : '• Me interesa valorar la nebulización en frío (ULV), desde 50 €.'),
      (english ? 'Estimated amount: ' : 'Importe orientativo: ') + (ulv ? from : '') + money(total),
      '\n' + (english ? 'My town is: ' : 'Mi localidad es: '),
    ].filter(Boolean).join('\n');

    setValues(panel, {
      n: rooms, nLabel: bedroom(rooms), vN: steamRooms, vLabel: bedroom(steamRooms),
      sofas, sLabel: english ? (sofas === 1 ? 'item' : 'items') : (sofas === 1 ? 'unidad' : 'unidades'),
      vaporTick: steam ? '✓' : '', ulvTick: ulv ? '✓' : '',
      total: money(total), totalPrefix: summaryLabel, waText: message,
    });
    for (const link of quoteLinks) {
      link.href = wa(message);
      link.dataset.plan = plan;
      const badge = link.querySelector('[data-value="total"]');
      if (badge) badge.textContent = 'WhatsApp · ' + (ulv ? from : '') + money(total);
    }

    for (const button of plans) {
      const selected = button.dataset.action === plan;
      button.setAttribute('aria-checked', selected);
      button.tabIndex = selected ? 0 : -1;
      button.children[0].lastElementChild.textContent = selected ? (english ? '● Selected' : '● Elegido') : '○';
      button.lastElementChild.textContent = money(price(button.dataset.action));
    }

    for (const [action, active] of [['toggleVapor', steam], ['toggleUlv', ulv]]) {
      panel.querySelector('[data-action="' + action + '"]').setAttribute('aria-checked', active);
    }
    panel.querySelector('.cdc-vapor').hidden = !steam;
    for (const row of table.querySelectorAll('[data-row]')) {
      row.classList.toggle('is-selected', Number(row.dataset.row) === Math.min(rooms, 5));
    }
    for (const [action, atLimit] of Object.entries({
      decN: rooms === 1, incN: rooms === 10,
      decV: steamRooms === 1, incV: steamRooms === rooms,
      decS: sofas === 0, incS: sofas === 6,
    })) {
      panel.querySelector('[data-action="' + action + '"]').setAttribute('aria-disabled', atLimit);
    }
  }

  const actions = {
    incN: () => setRooms(state.rooms + 1),
    decN: () => setRooms(state.rooms - 1),
    esencial: () => { state.plan = 'esencial'; },
    completo: () => { state.plan = 'completo'; },
    toggleVapor: () => {
      state.steam = !state.steam;
      if (state.steam) state.steamRooms = state.rooms;
    },
    incV: () => { state.steamRooms = clamp(state.steamRooms + 1, 1, state.rooms); },
    decV: () => { state.steamRooms = clamp(state.steamRooms - 1, 1, state.rooms); },
    incS: () => { state.sofas = clamp(state.sofas + 1, 0, 6); },
    decS: () => { state.sofas = clamp(state.sofas - 1, 0, 6); },
    toggleUlv: () => { state.ulv = !state.ulv; },
  };

  panel.addEventListener('click', event => {
    const control = event.target.closest('[data-action]');
    const action = actions[control?.dataset.action];
    if (!action || control.getAttribute('aria-disabled') === 'true') return;
    action();
    update();
  });

  table.addEventListener('click', event => {
    const row = event.target.closest('[data-row]');
    if (!row) return;
    setRooms(Number(row.dataset.row));
    update();
    panel.querySelector('h2').focus({ preventScroll: true });
    panel.scrollIntoView();
  });

  panel.querySelector('h2').tabIndex = -1;
  setupRadioKeys(panel.querySelector('[role="radiogroup"]'));
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

const calculator = document.querySelector('[data-calculator]');
if (calculator) setupCalculator(calculator);
const brief = document.querySelector('[data-brief]');
if (brief) setupBrief(brief);
