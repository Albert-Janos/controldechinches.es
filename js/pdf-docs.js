// Content and layout of every downloadable PDF (ES/EN). Pure functions: used by tools/build-pdfs.mjs (static files) and, for the detection report,
// in the visitor's browser (filled version). Content summarises the reviewed guide articles of the site; it is informational only.
import { Pdf, Layout, A4, textWidth, wrapText } from './pdf.js';

export const DOC_VERSION = '1.0';
export const DOC_DATE = '2026-11-28';
const fmtDate = (lang, iso) => { const [y, m, d] = iso.split('-'); return lang === 'en' ? `${Number(d)} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} ${y}` : `${d}/${m}/${y}`; };
export const CONTACT = { web: 'controldechinches.es', wa: '+34 605 259 206' };

export const PDF_DOCS = [
  { id: 'prep', es: { file: 'preparacion-antes-del-tratamiento-chinches.pdf', title: 'Preparación antes del tratamiento contra chinches' }, en: { file: 'pre-treatment-preparation-checklist-bed-bugs.pdf', title: 'Preparing for a bed bug treatment' } },
  { id: 'after', es: { file: 'despues-del-tratamiento-chinches.pdf', title: 'Qué hacer después del tratamiento contra chinches' }, en: { file: 'after-treatment-checklist-bed-bugs.pdf', title: 'What to do after a bed bug treatment' } },
  { id: 'recognise', es: { file: 'como-reconocer-chinches-lista-de-comprobacion.pdf', title: 'Cómo reconocer chinches de cama: lista de comprobación' }, en: { file: 'recognise-bed-bugs-checklist.pdf', title: 'How to recognise bed bugs: checklist' } },
  { id: 'apartments', es: { file: 'guia-apartamentos-turisticos-chinches.pdf', title: 'Guía de comprobación de chinches para apartamentos turísticos' }, en: { file: 'holiday-apartment-bed-bug-check-guide.pdf', title: 'Bed bug check guide for holiday apartments' } },
  { id: 'detection', es: { file: 'parte-de-deteccion-chinches.pdf', title: 'Parte de detección de chinches' }, en: { file: 'bed-bug-detection-report.pdf', title: 'Bed bug detection report' } },
  { id: 'log', es: { file: 'registro-de-monitorizacion-chinches.pdf', title: 'Registro de monitorización de chinches' }, en: { file: 'bed-bug-monitoring-log.pdf', title: 'Bed bug monitoring log' } },
];
const DISCLAIMER = {
  es: 'Documento informativo. No sustituye la documentación oficial u obligatoria de un tratamiento, ni las instrucciones del producto aplicado ni las indicaciones del técnico: en cuestiones de seguridad (ventilación, reentrada, niños, mascotas) siempre prevalecen la etiqueta del producto y las instrucciones del técnico.',
  en: 'Informational document. It does not replace the official or mandatory documentation of a treatment, nor the instructions of the product applied or of the technician: for safety questions (ventilation, re-entry, children, pets) the product label and the technician’s instructions always prevail.',
};
const DOCS = {
  prep: {
    es: { intro: 'Pasos generales de preparación según fuentes oficiales (EPA, NHS, universidades). La lista concreta depende del método y del producto elegidos, y te la indica el técnico antes del tratamiento.', sections: [
      ['Ropa y ropa de cama', ['Retira la ropa de cama y guárdala en una bolsa cerrada para llevarla a lavar.', 'Lava los textiles y sécalos con calor alto: según la EPA, lavar por sí solo generalmente no mata las chinches. Las cifras varían según la fuente (por ejemplo, lavado a 60 °C y secado en caliente al menos 30 minutos según el NHS).', 'Guarda la ropa limpia en bolsas cerradas, separada de la que aún no se ha tratado.']],
      ['La cama y la habitación', ['Deja accesible la zona que rodea la cama y los muebles cercanos.', 'Reduce el desorden para facilitar la inspección y el tratamiento.', 'No lleves objetos infestados a otra habitación: puedes extender el problema.', 'Protege alimentos, vajilla y objetos personales según te indique el técnico.', 'No apliques insecticidas domésticos por tu cuenta antes del tratamiento.']],
      ['Fundas, objetos y grietas', ['Protege el colchón y el somier con fundas específicas contra chinches (EPA, Virginia Tech); mejor resistentes al desgarro y de color claro.', 'Algunos objetos pueden congelarse: a −18 °C (0 °F) durante tres días según la EPA.', 'Las grietas pequeñas pueden sellarse con silicona (EPA). Es una medida complementaria: sellar no elimina por sí solo una infestación.']],
      ['Antes de que llegue el técnico', ['Anota dónde y cuándo viste indicios y ten a mano las fotos.', 'Acuerda la fecha y el acceso a la vivienda.', 'Pregunta cómo proceder con niños y mascotas: depende del producto aplicado.']],
    ] },
    en: { intro: 'General preparation steps according to official sources (EPA, NHS, universities). The specific list depends on the method and product chosen, and the technician tells you before the treatment.', sections: [
      ['Clothing and bedding', ['Strip the bedding and keep it in a closed bag to take to the wash.', 'Wash textiles and dry them on high heat: according to the EPA, washing alone generally does not kill bed bugs. Figures vary by source (for example, washing at 60 °C and hot drying for at least 30 minutes according to the NHS).', 'Keep clean clothes in closed bags, apart from items not yet treated.']],
      ['The bed and the room', ['Leave the area around the bed and nearby furniture accessible.', 'Reduce clutter to make the inspection and treatment easier.', 'Do not carry infested items to another room: you may spread the problem.', 'Protect food, crockery and personal items as the technician tells you.', 'Do not apply household insecticides yourself before the treatment.']],
      ['Encasements, objects and cracks', ['Protect the mattress and box spring with bed-bug-proof encasements (EPA, Virginia Tech); preferably tear-resistant and light-coloured.', 'Some items can be frozen: at −18 °C (0 °F) for three days according to the EPA.', 'Small cracks can be sealed with silicone (EPA). It is a complementary measure: sealing alone does not eliminate an infestation.']],
      ['Before the technician arrives', ['Note where and when you saw signs and keep the photos handy.', 'Agree the date and access to the property.', 'Ask how to proceed with children and pets: it depends on the product applied.']],
    ] },
  },
  after: {
    es: { intro: 'Seguimiento recomendado por fuentes oficiales tras un tratamiento. Los plazos de ventilación y reentrada dependen del método y del producto: sigue siempre las indicaciones del técnico y la etiqueta.', sections: [
      ['Seguridad y reentrada', ['Respeta el plazo de ventilación y reentrada que se te indique; la habitación tratada no se usa antes de que termine.', 'No laves las superficies tratadas antes de tiempo si el producto aplicado lo desaconseja.', 'Mantén separados los textiles limpios de los que no se han tratado.']],
      ['Seguimiento', ['Revisa la cama y los muebles al menos cada 7 días (EPA) y sigue comprobando durante al menos un año.', 'Si se han colocado interceptores bajo las patas de la cama, revísalos cada 1–2 semanas (Rutgers); solo se deja de vigilar tras un mes sin chinches.', 'Una inspección de seguimiento entre 10 y 21 días después de cada actuación (Purdue).', 'Mantén puestas las fundas protectoras durante mucho tiempo (al menos un año según Purdue y Zaragoza).']],
      ['Si vuelven a aparecer indicios', ['Anota dónde y cuándo los has visto y haz fotos.', 'Avísame cuanto antes por WhatsApp.', 'No muevas objetos de una habitación a otra.', 'Si ya se permite volver a la habitación tratada, evita mudarte a otro dormitorio.']],
    ] },
    en: { intro: 'Follow-up recommended by official sources after a treatment. Ventilation and re-entry times depend on the method and product: always follow the technician’s instructions and the label.', sections: [
      ['Safety and re-entry', ['Respect the ventilation and re-entry time you are given; the treated room is not used before it ends.', 'Do not wash treated surfaces early if the product applied advises against it.', 'Keep clean textiles separate from those not yet treated.']],
      ['Follow-up', ['Check the bed and furniture at least every 7 days (EPA) and keep checking for at least a year.', 'If interceptors have been placed under the bed legs, check them every 1–2 weeks (Rutgers); only stop monitoring after a month with no bed bugs.', 'A follow-up inspection 10 to 21 days after each intervention (Purdue).', 'Keep the protective encasements on for a long time (at least a year according to Purdue and Zaragoza).']],
      ['If signs reappear', ['Note where and when you saw them and take photos.', 'Tell me as soon as possible on WhatsApp.', 'Do not move items from one room to another.', 'If you are already allowed back into the treated room, avoid moving to another bedroom.']],
    ] },
  },
  recognise: {
    es: { intro: 'Una lista para revisar la cama y la habitación con linterna y, si es posible, con una lupa. Las picaduras por sí solas no permiten confirmar que haya chinches.', sections: [
      ['Qué buscar', ['Manchas rojizas u óxido en sábanas o colchón (pueden ser chinches aplastadas).', 'Puntos oscuros (excrementos) que pueden correrse sobre la tela como un rotulador.', 'Huevos de aproximadamente 1 mm, blanco perlado, y sus cáscaras.', 'Mudas (pieles) de color amarillo pálido.', 'Ejemplares vivos: los adultos miden unos 5–7 mm; las ninfas son translúcidas o amarillentas.', 'Algunas fuentes mencionan un olor dulzón o a humedad cuando la infestación es grande.']],
      ['Dónde mirar', ['Colchón: costuras, ribete y etiquetas, por los dos lados.', 'Somier: borde, esquinas y parte inferior.', 'Armazón de la cama y cabecero: uniones, grietas y parte trasera.', 'Muebles cercanos, rodapiés y grietas accesibles.', 'En infestaciones intensas: sofás, cortinas, uniones de cajones y enchufes.']],
      ['Si encuentras algo', ['Haz fotos nítidas con algo que dé escala (una moneda, una regla).', 'No muevas objetos de una habitación a otra.', 'Rellena el parte de detección y envíamelo por WhatsApp, o escríbeme directamente.', 'Recuerda: que no veas nada no descarta una infestación.']],
      ['Cuidado con las confusiones', ['Los escarabajos de alfombra y otros insectos pequeños se confunden fácilmente con las chinches.', 'Compara con el atlas fotográfico de la web o prueba el identificador.']],
    ] },
    en: { intro: 'A list for checking the bed and the room with a torch and, if possible, a magnifier. Bites alone cannot confirm that you have bed bugs.', sections: [
      ['What to look for', ['Reddish or rust-coloured stains on sheets or mattress (may be crushed bed bugs).', 'Dark spots (droppings) that can smear on fabric like a marker.', 'Eggs of about 1 mm, pearly white, and their shells.', 'Shed skins of a pale yellow colour.', 'Live insects: adults are about 5–7 mm; nymphs are translucent or yellowish.', 'Some sources mention a sweetish or musty smell when the infestation is large.']],
      ['Where to look', ['Mattress: seams, piping and tags, on both sides.', 'Box spring: edge, corners and underside.', 'Bed frame and headboard: joints, cracks and the back.', 'Nearby furniture, skirting boards and accessible cracks.', 'In heavy infestations: sofas, curtains, drawer joints and sockets.']],
      ['If you find something', ['Take sharp photos with something for scale (a coin, a ruler).', 'Do not move items from one room to another.', 'Fill in the detection report and send it to me on WhatsApp, or message me directly.', 'Remember: seeing nothing does not rule out an infestation.']],
      ['Beware of look-alikes', ['Carpet beetles and other small insects are easily mistaken for bed bugs.', 'Compare with the photo atlas on the website or try the identifier.']],
    ] },
  },
  apartments: {
    es: { intro: 'Una guía para revisar un apartamento turístico y actuar ante una sospecha, basada en las guías de La Rioja y Purdue resumidas en la web. Es orientativa: no sustituye un tratamiento ni la documentación que exija la normativa.', sections: [
      ['Entre huéspedes', ['Revisa colchón, ropa de cama y somier (costuras, ribete, etiquetas, armazón y cabecero).', 'Revisa los muebles tapizados, las mesillas y los rodapiés cercanos a la cama.', 'Usa soporte para maletas alejado de la cama y colchones con fundas cerradas con cremallera.', 'Anota la revisión en un registro (hay uno descargable) con fecha y unidad.']],
      ['Ante una queja o una sospecha', ['Inspecciona de inmediato y a fondo la unidad.', 'Aísla la unidad y las contiguas (en horizontal y en vertical) hasta valorar el caso.', 'Ensaca los objetos en doble bolsa estanca y etiquétalos; lava la ropa de cama por separado.', 'No muevas objetos de una unidad a otra. Haz fotos y rellena el parte de detección.', 'Escríbeme por WhatsApp con fotos y las unidades afectadas.']],
      ['En edificios con varias unidades', ['Inspecciona todas las unidades y las zonas comunes (Purdue): las chinches pasan de una a otra.', 'Coordina con el resto de gestores o vecinos.', 'En muchos casos los residentes no saben que tienen chinches: no esperes a que se quejen.']],
      ['Qué puedo hacer yo', ['Tratamiento puntual: químico dirigido, vapor seco o combinado, con revisión de unidades contiguas cuando está justificado.', 'No ofrezco suscripciones, inspecciones periódicas independientes ni formación del personal.']],
    ] },
    en: { intro: 'A guide to checking a holiday apartment and acting on a suspicion, based on the La Rioja and Purdue guides summarised on the website. It is indicative: it does not replace a treatment or the documentation the regulations require.', sections: [
      ['Between guests', ['Check the mattress, bedding and box spring (seams, piping, tags, frame and headboard).', 'Check upholstered furniture, bedside tables and the skirting boards near the bed.', 'Use a luggage rack away from the bed and zip-closed mattress encasements.', 'Note the check in a log (there is a downloadable one) with date and unit.']],
      ['On a complaint or suspicion', ['Inspect the unit immediately and thoroughly.', 'Isolate the unit and the adjacent ones (horizontally and vertically) until the case is assessed.', 'Bag items in double sealed bags and label them; wash bedding separately.', 'Do not move items from one unit to another. Take photos and fill in the detection report.', 'Message me on WhatsApp with photos and the affected units.']],
      ['In buildings with several units', ['Inspect all units and the common areas (Purdue): bed bugs move from one to another.', 'Coordinate with other managers or neighbours.', 'In many cases residents do not know they have bed bugs: do not wait for complaints.']],
      ['What I can do', ['One-off treatment: targeted chemical, dry steam or combined, with inspection of adjacent units when justified.', 'I do not offer subscriptions, stand-alone regular inspections or staff training.']],
    ] },
  },
};
const FORM = {
  es: { title: 'Parte de detección de chinches', fields: ['Fecha y hora', 'Alojamiento / vivienda', 'Habitación o unidad', 'Persona que informa', 'Localidad', 'Teléfono de contacto'], checks: ['Insecto vivo', 'Manchas oscuras (posibles excrementos)', 'Huevos', 'Mudas', 'Marcas en las costuras del colchón', 'Marcas en el somier o el cabecero', 'Marcas en muebles tapizados', 'Fotos adjuntas (con algo que dé escala)'], observed: 'Indicios observados', note: 'Las picaduras por sí solas no permiten confirmar que haya chinches. Este formulario registra observaciones; no es un diagnóstico. Envíalo por WhatsApp junto con las fotos.' },
  en: { title: 'Bed bug detection report', fields: ['Date and time', 'Property / accommodation', 'Room or unit', 'Reported by', 'Town', 'Contact phone'], checks: ['Live insect', 'Dark spots (possible excreta)', 'Eggs', 'Moults', 'Marks along mattress seams', 'Marks on the bed frame or headboard', 'Marks on upholstered furniture', 'Photos attached (with something for scale)'], observed: 'Signs observed', note: 'Bites alone cannot confirm bed bugs. This form records observations; it is not a diagnosis. Send it on WhatsApp together with the photos.' },
};
export const detectionForm = FORM;
const LOG = {
  es: { fields: ['Alojamiento', 'Responsable de la revisión'], head: ['Fecha', 'Unidad', 'Zona revisada', 'Resultado', 'Observaciones / fotos'], note: 'Este es tu registro interno de revisiones, no un servicio de monitorización. Anota el resultado tal como lo observas. Si ves indicios, rellena el parte de detección online en controldechinches.es y envíamelo por WhatsApp.' },
  en: { fields: ['Accommodation', 'Person responsible for the check'], head: ['Date', 'Unit', 'Area checked', 'Result', 'Notes / photos'], note: 'This is your own internal check log, not a monitoring service. Note the result as you observe it. If you see signs, fill in the online detection report at controldechinches.es and send it to me on WhatsApp.' },
};

function frame(lang, title, logo) {
  const pdf = new Pdf({ title, author: 'Control de Chinches', subject: title, keywords: 'chinches de cama, bed bugs', lang, logo, date: new Date(DOC_DATE + 'T09:00:00Z') });
  const header = p => {
    const h = p.image(50, 26, 78);
    p.text('Control de Chinches', A4.w - 50, 44, { size: 12, bold: true, align: 'right', color: [0.07, 0.1, 0.14] });
    p.text(CONTACT.web, A4.w - 50, 58, { size: 9, align: 'right', color: [0.35, 0.4, 0.45] });
    p.line(50, 26 + Math.max(h, 32) + 8, A4.w - 50, 26 + Math.max(h, 32) + 8, { lw: 1.2, color: [0.96, 0.78, 0] });
  };
  header(pdf);
  const lay = new Layout(pdf, { margin: 50, top: 96, bottom: 60, onNewPage: header });
  return { pdf, lay };
}
function footers(pdf, lang) {
  const total = pdf.pages.length, v = lang === 'en' ? 'Version' : 'Versión', up = lang === 'en' ? 'Updated' : 'Actualizado', pg = lang === 'en' ? 'Page' : 'Página', of = lang === 'en' ? 'of' : 'de';
  pdf.pages.forEach((page, i) => {
    pdf.cur = page;
    pdf.line(50, A4.h - 46, A4.w - 50, A4.h - 46, { lw: 0.5, color: [0.7, 0.72, 0.74] });
    pdf.text(`Control de Chinches · ${CONTACT.web} · WhatsApp ${CONTACT.wa}`, 50, A4.h - 33, { size: 8, color: [0.35, 0.4, 0.45] });
    pdf.text(`${v} ${DOC_VERSION} · ${up} ${fmtDate(lang, DOC_DATE)} · ${pg} ${i + 1} ${of} ${total}`, A4.w - 50, A4.h - 33, { size: 8, align: 'right', color: [0.35, 0.4, 0.45] });
  });
}
function formBody(lay, lang, data) {
  const F = FORM[lang], pdf = lay.pdf, d = data || {};
  lay.h1(F.title);
  const keys = ['datetime', 'property', 'unit', 'reporter', 'town', 'phone'], half = (lay.W - 20) / 2;
  for (let r = 0; r < 3; r++) { const a = r * 2; lay.field(F.fields[a], d[keys[a]] || '', { w: half }); lay.field(F.fields[a + 1], d[keys[a + 1]] || '', { w: half, x: lay.m + half + 20 }); lay.y += 38; }
  lay.h2(F.observed);
  lay.checklist(F.checks, { size: 11, checked: i => !!(d.checks && d.checks[i]) });
  lay.gap(6);
  lay.note(F.note);
  lay.note(DISCLAIMER[lang]);
}
export function buildDocument(id, lang, { logo = null, data = null } = {}) {
  const def = PDF_DOCS.find(x => x.id === id)[lang];
  const { pdf, lay } = frame(lang, def.title, logo);
  if (id === 'detection') formBody(lay, lang, data);
  else if (id === 'log') {
    const L = LOG[lang]; lay.h1(def.title); const half = (lay.W - 20) / 2;
    lay.field(L.fields[0], '', { w: half }); lay.field(L.fields[1], '', { w: half, x: lay.m + half + 20 }); lay.y += 38;
    lay.table(L.head, Array.from({ length: 12 }, () => L.head.map(() => '')), [1.1, 1.1, 1.6, 1.3, 2.4], { rowH: 30 });
    lay.note(L.note); lay.note(DISCLAIMER[lang]);
  } else {
    const c = DOCS[id][lang]; lay.h1(def.title); lay.p(c.intro, { size: 10.5, gapAfter: 6 });
    for (const [h, items] of c.sections) { lay.h2(h); lay.checklist(items, { size: 10 }); }
    lay.gap(4); lay.note(DISCLAIMER[lang]);
  }
  footers(pdf, lang);
  return pdf.bytes();
}
export { textWidth, wrapText };
