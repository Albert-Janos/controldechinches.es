// Inline, responsive, accessible SVG infographics (ES/EN). Content is limited to facts taken from the cited sources or to process steps;
// nothing here is a biological drawing. Horizontal layout for wide screens, vertical for phones (CSS toggles .sx-ig-h / .sx-ig-v).
import { esc } from './components.mjs';

const NAVY = '#23303e', YEL = '#f5c800', INK = '#1c2530', LINE = '#d9dcd9', SURF = '#f7f5ef';

// ---- text measuring: wrap by estimated pixel width (not by character count) so long ES/EN labels never leave their card ----
// Average advance in em for DM Sans / system-ui fallback; deliberately generous so a fallback font cannot overflow either.
const EM = { reg: 0.56, bold: 0.62 };
const tw = (s, size, bold) => String(s).length * size * (bold ? EM.bold : EM.reg);
function wrapPx(text, maxPx, size, bold) {
  const out = []; let cur = '';
  for (const w of String(text).split(/\s+/).filter(Boolean)) {
    const next = cur ? cur + ' ' + w : w;
    if (cur && tw(next, size, bold) > maxPx) { out.push(cur); cur = w; } else cur = next;
  }
  if (cur) out.push(cur); return out;
}
const tspans = (lines, x, dy) => lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : dy}">${esc(l)}</tspan>`).join('');

// card geometry: circle number + title (15px bold, 18px leading) + body (13px, 16px leading); height follows the wrapped text
const TS = 15, TL = 18, BS = 13, BL = 16;
function measure(step, w) {
  const tl = wrapPx(step.h, w - 42 - 12, TS, true), bl = step.p ? wrapPx(step.p, w - 28, BS, false) : [];
  const titleLast = 27 + (tl.length - 1) * TL;
  const bodyStart = Math.max(titleLast, 35) + 22;
  const h = bl.length ? bodyStart + (bl.length - 1) * BL + 15 : Math.max(titleLast + 17, 44);
  return { tl, bl, bodyStart, h };
}
function card(step, i, x, y, w, h, m) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${i % 2 ? SURF : '#fff'}" stroke="${NAVY}" stroke-width="1.5"/><circle cx="${x + 20}" cy="${y + 22}" r="13" fill="${YEL}"/><text x="${x + 20}" y="${y + 27}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${i + 1}</text><text x="${x + 42}" y="${y + 27}" font-size="${TS}" font-weight="700" fill="${INK}">${tspans(m.tl, x + 42, TL)}</text>${m.bl.length ? `<text x="${x + 14}" y="${y + m.bodyStart}" font-size="${BS}" fill="#475767">${tspans(m.bl, x + 14, BL)}</text>` : ''}</g>`;
}

// One flow diagram = two SVGs (wide + phone). Every SVG gets its own marker id (ids must be unique per page).
function flow(ctx, { title, desc, steps, note }) {
  const uid = ctx._svgN = (ctx._svgN || 0) + 1, n = steps.length, pad = 16;
  const hid = `ig-arrow-${uid}-h`, vid = `ig-arrow-${uid}-v`;
  // ----- wide layout: 2 steps -> 2 wide cards; 4 -> 2x2; otherwise 3 per row; row height = tallest card of the row
  const W = n <= 2 ? 300 : 220, G = 32, RG = 26, cols = n <= 2 ? n : n === 4 ? 2 : 3, rows = Math.ceil(n / cols);
  const hw = pad * 2 + cols * W + (cols - 1) * G;
  const ms = steps.map(s => measure(s, W)), rowH = Array.from({ length: rows }, (_, r) => Math.max(...ms.slice(r * cols, r * cols + cols).map(m => m.h)));
  const noteH = wrapPx(note || '', hw - pad * 2, BS, false);
  const bodyH = rowH.reduce((t, x) => t + x, 0) + (rows - 1) * RG, hh = pad * 2 + bodyH + (note ? 12 + noteH.length * BL : 0);
  let h = ''; steps.forEach((s, i) => {
    const c = i % cols, r = Math.floor(i / cols), x = pad + c * (W + G), y = pad + rowH.slice(0, r).reduce((t, v) => t + v + RG, 0);
    h += card(s, i, x, y, W, rowH[r], ms[i]);
    if (c < cols - 1 && i < n - 1) h += `<path d="M${x + W + 5} ${y + rowH[r] / 2} h${G - 12}" stroke="${NAVY}" stroke-width="2" fill="none" marker-end="url(#${hid})"/>`;
  });
  if (note) h += `<text x="${pad}" y="${pad + bodyH + 24}" font-size="${BS}" fill="#475767">${tspans(noteH, pad, BL)}</text>`;
  // ----- phone layout: one column, card height follows its text
  const vw = 380, cw = vw - pad * 2, vg = 24, mv = steps.map(s => measure(s, cw)), noteV = wrapPx(note || '', cw, BS, false);
  const vbody = mv.reduce((t, m) => t + m.h, 0) + (n - 1) * vg, vh = pad * 2 + vbody + (note ? 12 + noteV.length * BL : 0);
  let v = '', y = pad; steps.forEach((s, i) => {
    v += card(s, i, pad, y, cw, mv[i].h, mv[i]);
    if (i < n - 1) v += `<path d="M${vw / 2} ${y + mv[i].h + 3} v${vg - 9}" stroke="${NAVY}" stroke-width="2" fill="none" marker-end="url(#${vid})"/>`;
    y += mv[i].h + vg;
  });
  if (note) v += `<text x="${pad}" y="${pad + vbody + 24}" font-size="${BS}" fill="#475767">${tspans(noteV, pad, BL)}</text>`;
  const defs = mid => `<defs><marker id="${mid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${NAVY}"/></marker></defs>`;
  // max-width = viewBox width in px: the diagram is shown at 1:1 and never blown up (compact, readable)
  const svg = (cls, w, hgt, mid, body) => `<svg class="${cls}" viewBox="0 0 ${w} ${hgt}" style="max-width:${w}px" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans, system-ui, sans-serif"><title>${esc(title)}</title><desc>${esc(desc)}</desc>${defs(mid)}${body}</svg>`;
  return `<div class="sx-ig">${svg('sx-ig-h', hw, hh, hid, h)}${svg('sx-ig-v', vw, vh, vid, v)}</div>`;
}

const T = {
  es: {
    'IG-01': { title: 'Fases del control integrado de chinches (GIP)', desc: 'Seis fases: información y valoración, plan de tratamiento, tratamiento, refugios y rutas de propagación, seguimiento, asesoramiento y prevención.', steps: [['Información y valoración'], ['Plan de tratamiento'], ['Tratamiento'], ['Refugios y rutas de propagación'], ['Seguimiento'], ['Asesoramiento y prevención']], note: 'Esquema del proceso; los pasos que realiza cada parte se detallan en la tabla «Quién hace qué».' },
    'IG-02': { title: 'Ciclo de vida de la chinche de cama', desc: 'Huevo de unos 1 mm; cinco estadios de ninfa de unos 1,5; 2; 2,5; 3 y 4,5 mm; adulto de unos 5 a 7 mm. Cada estadio necesita una comida de sangre para mudar.', steps: [['Huevo', '≈ 1 mm'], ['Ninfa 1', '≈ 1,5 mm'], ['Ninfa 2', '≈ 2 mm'], ['Ninfa 3', '≈ 2,5 mm'], ['Ninfa 4', '≈ 3 mm'], ['Ninfa 5', '≈ 4,5 mm'], ['Adulto', '≈ 5–7 mm']], note: 'Cada estadio de ninfa necesita una comida de sangre para mudar. Tamaños según la EPA.' },
    'IG-10': { title: 'Qué hacer ante la sospecha de chinches en un alojamiento', desc: 'Inspección, aislar la habitación y las contiguas, ensacar y etiquetar objetos, lavar la ropa de cama por separado, aviso al servicio de control de plagas, seguimiento.', steps: [['Inspección', 'Diaria en colchones, ropa de cama y somieres'], ['Sospecha', 'Comprobación inmediata y a fondo'], ['Aislar', 'Habitación y contiguas (horizontal y vertical)'], ['Ensacar', 'Doble bolsa estanca y etiqueta'], ['Lavar aparte', 'Ropa de cama por separado'], ['Actuar', 'Aviso a un profesional y seguimiento']], note: 'Resumen de la guía de La Rioja para establecimientos con pernoctación.' },
    'IG-11': { title: 'Lista de preparación previa al tratamiento', desc: 'Ropa y ropa de cama: lavar y secar a alta temperatura; fundas protectoras; sellar grietas pequeñas; congelar objetos adecuados; seguir las instrucciones del técnico.', steps: [['Ropa', 'Lavar y secar a alta temperatura'], ['Fundas', 'Colchón y somier protegidos'], ['Grietas', 'Sellar las pequeñas con silicona'], ['Congelar', 'Solo objetos que lo admitan'], ['Técnico', 'Seguir sus indicaciones']], note: 'Las cifras de temperatura y tiempo varían según la fuente: ver la tabla del artículo.' },
    'IG-12': { title: 'Lista posterior al tratamiento', desc: 'Respetar el plazo de reentrada del producto, revisar al menos cada 7 días, usar interceptores, inspección de seguimiento a los 10–21 días y mantener las fundas.', steps: [['Reentrada', 'Según la etiqueta y el técnico'], ['Revisar', 'Al menos cada 7 días'], ['Interceptores', 'Cada 1–2 semanas'], ['Seguimiento', 'Inspección a los 10–21 días'], ['Mantener', 'Fundas puestas al menos un año']], note: 'Resumen de EPA, Rutgers, Purdue y Zaragoza (ver fuentes).' },
    'IG-13': { title: 'Flujo de monitorización', desc: 'Colocar interceptores, revisarlos cada una o dos semanas, actuar si aparecen chinches y dejar de vigilar solo tras un mes sin chinches.', steps: [['Colocar', 'Interceptores bajo las patas de la cama'], ['Revisar', 'Cada 1–2 semanas'], ['¿Hay chinches?', 'Anotar y fotografiar'], ['Actuar', 'Consultar y tratar'], ['Continuar', 'Parar tras un mes sin chinches']], note: 'Según Rutgers; Purdue indica revisar cada 7–10 días.' },
    'IG-15': { title: 'Tratamiento puntual frente a control integrado', desc: 'Un tratamiento puntual aplica un método una vez; el control integrado incluye valoración previa, método adecuado, comprobación posterior y prevención.', steps: [['Tratamiento puntual', 'Un método, aplicado una vez'], ['Control integrado', 'Valoración, método adecuado, comprobación y prevención']], note: '' },
  },
  en: {
    'IG-01': { title: 'Stages of integrated pest management for bed bugs (IPM)', desc: 'Six stages: information and assessment, treatment plan, treatment, hiding places and routes of spread, follow-up, advice and prevention.', steps: [['Information and assessment'], ['Treatment plan'], ['Treatment'], ['Hiding places and routes of spread'], ['Follow-up'], ['Advice and prevention']], note: 'Process outline; who carries out each step is set out in the “Who does what” table.' },
    'IG-02': { title: 'Bed bug life cycle', desc: 'Egg about 1 mm; five nymph stages of about 1.5, 2, 2.5, 3 and 4.5 mm; adult about 5 to 7 mm. Each stage needs a blood meal to moult.', steps: [['Egg', '≈ 1 mm'], ['Nymph 1', '≈ 1.5 mm'], ['Nymph 2', '≈ 2 mm'], ['Nymph 3', '≈ 2.5 mm'], ['Nymph 4', '≈ 3 mm'], ['Nymph 5', '≈ 4.5 mm'], ['Adult', '≈ 5–7 mm']], note: 'Each nymph stage needs a blood meal to moult. Sizes according to the EPA.' },
    'IG-10': { title: 'What to do when bed bugs are suspected in accommodation', desc: 'Inspection, isolate the room and adjacent rooms, bag and label items, wash bedding separately, alert pest control, follow-up.', steps: [['Inspection', 'Daily for mattresses, bedding and box springs'], ['Suspicion', 'Immediate, thorough check'], ['Isolate', 'Room and adjacent rooms (horizontal and vertical)'], ['Bag', 'Double sealed bag and label'], ['Wash apart', 'Bedding washed separately'], ['Act', 'Alert a professional and follow up']], note: 'Summary of the La Rioja guide for lodging establishments.' },
    'IG-11': { title: 'Pre-treatment preparation checklist', desc: 'Clothing and bedding: wash and dry at high temperature; protective encasements; seal small cracks; freeze suitable items; follow your technician’s instructions.', steps: [['Clothing', 'Wash and dry at high temperature'], ['Encasements', 'Mattress and box spring protected'], ['Cracks', 'Seal small ones with silicone'], ['Freeze', 'Only suitable items'], ['Technician', 'Follow their guidance']], note: 'Temperatures and times vary by source: see the table in the article.' },
    'IG-12': { title: 'Post-treatment checklist', desc: 'Respect the product’s re-entry time, check at least every 7 days, use interceptors, a follow-up inspection after 10–21 days and keep encasements on.', steps: [['Re-entry', 'Per label and technician'], ['Check', 'At least every 7 days'], ['Interceptors', 'Every 1–2 weeks'], ['Follow-up', 'Inspection after 10–21 days'], ['Keep on', 'Encasements on for at least a year']], note: 'Summary of EPA, Rutgers, Purdue and Zaragoza (see sources).' },
    'IG-13': { title: 'Monitoring flow', desc: 'Place interceptors, check them every one or two weeks, act if bed bugs appear and stop monitoring only after a month with none.', steps: [['Place', 'Interceptors under the bed legs'], ['Check', 'Every 1–2 weeks'], ['Any bed bugs?', 'Note and photograph'], ['Act', 'Get advice and treat'], ['Continue', 'Stop after a month with none']], note: 'According to Rutgers; Purdue says to check every 7–10 days.' },
    'IG-15': { title: 'One-off treatment versus integrated control', desc: 'A one-off treatment applies one method once; integrated control includes an assessment first, the right method, a later check and prevention.', steps: [['One-off treatment', 'One method, applied once'], ['Integrated control', 'Assessment, right method, check and prevention']], note: '' },
  },
};
export const infographics = {};
for (const id of Object.keys(T.es)) infographics[id] = ctx => { const d = T[ctx.lang][id]; return flow(ctx, { title: d.title, desc: d.desc, steps: d.steps.map(([h, p]) => ({ h, p })), note: d.note }); };
