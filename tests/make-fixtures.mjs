// Generates NON-PUBLIC template fixtures (tests/fixtures/pages/*.json): neutral test text, one page per template.
// They validate templates/components; they are never built in production and contain no professional claims.
// Usage: node tests/make-fixtures.mjs
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/pages');
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const para = (n = 1) => Array.from({ length: n }, () => '<p>Texto de prueba para validar la maqueta. Este contenido no es publicable.</p>').join('');
const paraEn = (n = 1) => Array.from({ length: n }, () => '<p>Test text to validate the layout. This content is not publishable.</p>').join('');

const common = (id, template, slugEs, slugEn, extra = {}) => ({
  id, template, status: 'Draft', dataPage: extra.dataPage || 'fixture', cta: extra.cta || { message: 'default' }, related: extra.related || [], dates: { published: '2026-01-01', modified: '2026-01-02' },
  es: { url: `/__fixture__/${slugEs}/`, title: `Fixture ${id} (ES) | Control de Chinches`, description: `Fixture de prueba ${id}. No publicable.`, h1: `Fixture ${id}: ${template}`, eyebrow: 'Prueba de plantilla', lead: 'Texto introductorio de prueba para comprobar la maqueta en escritorio y móvil.', answer: 'Respuesta breve de prueba: dos frases para validar el cuadro de respuesta.', breadcrumb: [['Pruebas', '/__fixture__/hub/']], heroImage: extra.hero || null, reviewer: null, blocks: [], faq: [], sources: [] },
  en: { url: `/en/__fixture__/${slugEn}/`, title: `Fixture ${id} (EN) | Control de Chinches`, description: `Test fixture ${id}. Not publishable.`, h1: `Fixture ${id}: ${template}`, eyebrow: 'Template test', lead: 'Introductory test text to check the layout on desktop and mobile.', answer: 'Short test answer: two sentences to validate the answer box.', breadcrumb: [['Tests', '/en/__fixture__/hub/']], heroImage: extra.hero || null, reviewer: null, blocks: [], faq: [], sources: [] },
});
const both = (p, fnEs, fnEn) => { p.es.blocks = fnEs(false); p.en.blocks = fnEn(true); return p; };
const faqEs = [{ q: '¿Pregunta de prueba uno?', a: 'Respuesta de prueba uno.' }, { q: '¿Pregunta de prueba dos?', a: 'Respuesta de prueba dos.' }];
const faqEn = [{ q: 'Test question one?', a: 'Test answer one.' }, { q: 'Test question two?', a: 'Test answer two.' }];
const srcs = [{ title: 'Fuente de prueba', publisher: 'Editor de prueba', year: '2026', url: 'https://example.org/test', checked: 'comprobada 2026-01-01' }];
const out = [];

// T-B service-like (all common blocks)
const B = (en) => [
  { type: 'facts', items: [{ label: en ? 'Where' : 'Dónde', value: en ? 'Test' : 'Prueba' }, { label: en ? 'Time' : 'Tiempo', value: '1–2 h' }, { label: en ? 'From' : 'Desde', value: en ? '€150' : '150 €' }] },
  { type: 'text', h2: en ? 'Problem and solution' : 'Problema y solución', html: en ? paraEn(2) : para(2) },
  { type: 'figure', image: 'IMG-DRY-04' },
  { type: 'infographic', id: 'IG-14' },
  { type: 'steps', h2: en ? 'Workflow' : 'Flujo de trabajo', items: [1, 2, 3].map(n => ({ h3: (en ? 'Step ' : 'Paso ') + n, p: en ? 'Test step description.' : 'Descripción del paso de prueba.' })) },
  { type: 'proscons', h2: en ? 'Advantages and limits' : 'Ventajas y limitaciones', pros: ['A', 'B'], cons: ['C', 'D'] },
  { type: 'roles', h2: en ? 'Who does what' : 'Quién hace qué', columns: [{ title: en ? 'Done by the owner' : 'Lo realiza el propietario', items: ['x', 'y'] }, { title: en ? 'Recommended' : 'Se recomienda', items: ['z'] }, { title: en ? 'External contractor' : 'Contratista externo', items: ['w'] }] },
  { type: 'table', h2: en ? 'Comparison' : 'Comparativa', caption: en ? 'Test table' : 'Tabla de prueba', head: ['Método', 'A', 'B'], rows: [['Fila 1', '1', '2'], ['Fila 2', '3', '4']] },
  { type: 'priceBox', h2: en ? 'Prices' : 'Precios' },
  { type: 'cards', h2: en ? 'Related' : 'Relacionado', items: [{ title: 'Uno', text: 'Texto', href: '/__fixture__/hub/' }, { title: 'Dos', text: 'Texto' }] },
  { type: 'todo', text: 'OWNER-INPUT #7: bloque de ejemplo visible solo en preview.' },
];
const tb = common('FX-B', 'T-B', 'service', 'service', { hero: 'IMG-DRY-10', dataPage: 'service' }); tb.offers = ['chemical', 'steam'];
both(tb, B, B); tb.es.faq = faqEs; tb.en.faq = faqEn; tb.es.sources = srcs; tb.en.sources = srcs; out.push(tb);

// T-A local
const ta = common('FX-A', 'T-A', 'local', 'local', { hero: 'IMG-LOC-ALC-01', dataPage: 'local' }); ta.areaServed = ['Alicante'];
both(ta, (en) => [{ type: 'text', h2: 'Resumen local', html: para(1) }, { type: 'priceBox', h2: 'Precios' }, { type: 'text', h2: 'Tipos de vivienda', html: para(1) }], (en) => [{ type: 'text', h2: 'Local summary', html: paraEn(1) }, { type: 'priceBox', h2: 'Prices' }, { type: 'text', h2: 'Property types', html: paraEn(1) }]);
ta.es.faq = faqEs; ta.en.faq = faqEn; out.push(ta);

// T-C article
const tc = common('FX-C', 'T-C', 'article', 'article', { hero: 'IMG-INS-01', dataPage: 'article' });
tc.related = ['FX-B'];
both(tc, () => [{ type: 'text', h2: 'Primera sección', html: para(3) }, { type: 'figure', image: 'IMG-ENT-HID-01' }, { type: 'text', h2: 'Segunda sección', html: para(3) }, { type: 'table', h2: 'Comparación', caption: 'Tabla', head: ['A', 'B'], rows: [['x', 'y']] }, { type: 'text', h2: 'Tercera sección', html: para(2) }], () => [{ type: 'text', h2: 'First section', html: paraEn(3) }, { type: 'figure', image: 'IMG-ENT-HID-01' }, { type: 'text', h2: 'Second section', html: paraEn(3) }, { type: 'table', h2: 'Comparison', caption: 'Table', head: ['A', 'B'], rows: [['x', 'y']] }, { type: 'text', h2: 'Third section', html: paraEn(2) }]);
tc.es.faq = faqEs; tc.en.faq = faqEn; tc.es.sources = srcs; tc.en.sources = srcs; tc.es.reviewer = 'Revisor de prueba'; out.push(tc);

// T-D about
const td = common('FX-D', 'T-D', 'about', 'about', { hero: 'IMG-ABOUT-01', dataPage: 'about', cta: { message: 'default', hero: false } });
both(td, () => [{ type: 'text', h2: 'Presentación', html: para(1) }, { type: 'timeline', h2: 'Trayectoria', items: [{ when: '2020', text: 'Hito de prueba' }, { when: '2024', text: 'Hito de prueba' }] }, { type: 'docs', h2: 'Documentos', images: ['IMG-CRED-01', 'IMG-CRED-03', 'IMG-CRED-04'] }, { type: 'todo', text: 'OWNER-INPUT #13: titulación.' }], () => [{ type: 'text', h2: 'Introduction', html: paraEn(1) }, { type: 'timeline', h2: 'Path', items: [{ when: '2020', text: 'Test milestone' }, { when: '2024', text: 'Test milestone' }] }, { type: 'docs', h2: 'Documents', images: ['IMG-CRED-01', 'IMG-CRED-03', 'IMG-CRED-04'] }, { type: 'todo', text: 'OWNER-INPUT #13: qualification.' }]);
out.push(td);

// T-E B2B
const te = common('FX-E', 'T-E', 'b2b', 'b2b', { hero: 'IMG-B2B-01', dataPage: 'b2b', cta: { message: 'b2b' } });
both(te, () => [{ type: 'text', h2: 'Problemas del operador', html: para(1) }, { type: 'steps', h2: 'Proceso', items: [{ h3: 'Uno', p: 'Prueba' }, { h3: 'Dos', p: 'Prueba' }] }], () => [{ type: 'text', h2: 'Operator problems', html: paraEn(1) }, { type: 'steps', h2: 'Process', items: [{ h3: 'One', p: 'Test' }, { h3: 'Two', p: 'Test' }] }]);
out.push(te);

// T-F case study
const tf = common('FX-F', 'T-F', 'case', 'case', { hero: 'IMG-INS-06', dataPage: 'case' });
both(tf, () => [{ type: 'facts', items: [{ label: 'Población', value: 'Prueba' }, { label: 'Inmueble', value: 'Piso' }, { label: 'Método', value: 'Prueba' }] }, { type: 'timeline', h2: 'Cronología', items: [{ when: 'Día 0', text: 'Prueba' }] }], () => [{ type: 'facts', items: [{ label: 'Town', value: 'Test' }, { label: 'Property', value: 'Flat' }, { label: 'Method', value: 'Test' }] }, { type: 'timeline', h2: 'Timeline', items: [{ when: 'Day 0', text: 'Test' }] }]);
out.push(tf);

// T-G atlas
const tg = common('FX-G', 'T-G', 'atlas', 'atlas', { dataPage: 'atlas', cta: { message: 'identify' } });
const gal = (en) => [{ type: 'gallery', h2: en ? 'Photos' : 'Fotos', filters: [{ id: 'adultos', label: en ? 'Adults' : 'Adultos' }, { id: 'huevos', label: en ? 'Eggs' : 'Huevos' }], groups: [{ id: 'adultos', h3: en ? 'Adults' : 'Adultos', images: ['IMG-ENT-ADU-01', 'IMG-ENT-ADU-02', 'IMG-ENT-ADU-03'] }, { id: 'huevos', h3: en ? 'Eggs' : 'Huevos', images: ['IMG-ENT-EGG-01', 'IMG-ENT-EGG-02'] }] }];
both(tg, gal, gal); out.push(tg);

// T-H hub
const th = common('FX-H', 'T-H', 'hub', 'hub', { dataPage: 'hub', cta: { message: 'default' } });
const hub = (en) => [{ type: 'hub', groups: [{ h2: en ? 'Group one' : 'Grupo uno', intro: en ? 'Intro' : 'Introducción', items: [{ pageId: 'FX-B', text: en ? 'Service page' : 'Página de servicio' }, { pageId: 'FX-C', text: en ? 'Article' : 'Artículo' }] }, { h2: en ? 'Group two' : 'Grupo dos', items: [{ pageId: 'FX-A', text: 'Local' }] }] }];
both(th, hub, hub); th.es.faq = faqEs; th.en.faq = faqEn; out.push(th);

// T-I tool
const ti = common('FX-I', 'T-I', 'tool', 'tool', { dataPage: 'tool', cta: { message: 'identify' } });
const toolBlock = (en) => [{ type: 'tool', h2: en ? 'Identifier' : 'Identificador', outcomesTitle: en ? 'What to do' : 'Qué hacer', questions: [{ id: 'live', text: en ? 'Did you see a live insect?' : '¿Has visto un insecto vivo?' }, { id: 'spots', text: en ? 'Dark spots on the mattress seams?' : '¿Puntos oscuros en las costuras?' }], outcomes: [{ id: 'high', rule: { minYes: 2 }, title: en ? 'Several signs' : 'Varios indicios', text: en ? 'Send photos for identification.' : 'Envía fotos para identificarlo.' }, { id: 'some', rule: { minYes: 1 }, title: en ? 'A sign' : 'Un indicio', text: en ? 'Check the mattress seams.' : 'Revisa las costuras.' }, { id: 'none', rule: { default: true }, title: en ? 'No signs' : 'Sin indicios', text: en ? 'Keep monitoring.' : 'Sigue vigilando.' }] }];
both(ti, toolBlock, toolBlock); out.push(ti);

for (const p of out) writeFileSync(join(dir, p.id + '.json'), JSON.stringify(p, null, 1) + '\n');
console.log('fixtures written:', out.map(p => p.id).join(' '));
