// Writes docs/seo/MISSING-IMAGES.md (Hungarian): exact list of what is still missing, per page and section, from the CURRENT page data
// + image manifest.  Re-run after every image delivery:  node tools/build-missing-images-doc.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { makeContext } from './build.mjs';

const ctx = makeContext({ mode: 'preview', pageDirs: ['data/pages'] });
const proc = JSON.parse(readFileSync(new URL('../data/images-processed.json', import.meta.url), 'utf8'));
const HU = {
  'IMG-DRY-04': 'Szárazgőzös kezelés egy matracvarraton: a fúvóka a matrac szegélyvarrásán, a gőz látható, a matrac szövete jól látszik; a háttérben nincs ügyfél-azonosító adat.',
  'IMG-DRY-03': 'A Polti kezelőfeje közelről (10–20 cm), kezben, látható gőzzel.',
  'IMG-DRY-02': 'A gép kezelőpaneljének és manométerének közelije.',
  'IMG-DRY-06': 'Gőzölés a fejtámlán (kárpitozott vagy fa fejtámla hátoldala és illesztései).',
  'IMG-DRY-07': 'Gőzölés bútorillesztésen / fiókvezetőn.',
  'IMG-DRY-08': 'Gőzölés kárpitozott kanapén vagy fotelen (varratok).',
  'IMG-DRY-09': 'A teljes hálószoba szélesen, a gőzös kezelés közben (munkafolyamat).',
  'IMG-ABOUT-01': 'Fekvő portré munkaruhában (derékig/mellkasig), természetes fényben, rendezett háttérrel, a tekintet a kamerába; legalább 2400 px széles.',
  'IMG-ABOUT-03': 'Álló, egész alakos kép munkaruhában, a munkafelszereléssel.',
  'IMG-ABOUT-04': 'Munka közben: a matracvarrat átvizsgálása lámpával (arc nem kötelező).',
  'IMG-ABOUT-06': 'A tulajdonos a kirakott, előkészített munkafelszereléssel.',
  'IMG-ABOUT-08': 'A felderítési megállapítások dokumentálása a helyszínen (jegyzet/fotó), ügyféladat nélkül.',
  'IMG-ABOUT-09': 'Az eszközök előkészítése a kezelés előtt (a ténylegesen használt felszerelés).',
  'IMG-ABOUT-10': 'Természetes munkakörnyezeti hangulatkép a tulajdonosról.',
  'IMG-CRED-01': 'Az egészségügyi kártevőirtó (magyar) szakképesítést igazoló bizonyítvány szkennelve (300 dpi) vagy egyenesen fotózva, kitakarás nélkül (a kitakarást mi végezzük, visszafordíthatatlanul).',
  'IMG-CRED-02': 'Szakmai nyilvántartási igazolás — a tulajdonos döntése szerint a nyilvántartási szám nem publikálható, ezért ez a kép valószínűleg elhagyható.',
  'IMG-CRED-03': 'További képzést igazoló oklevél/bizonyítvány (cím, kiállító, év olvasható).',
  'IMG-CRED-04': 'További tanúsítvány vagy kurzusigazolás (téma és kiállító olvasható).',
  'IMG-CRED-06': 'Egyéb ellenőrizhető szakmai dokumentum.',
  'IMG-PREV-01': 'Poggyász átvizsgálása utazás után (bőrönd varratai, lámpával).',
  'IMG-PREP-01': 'A kezelésre előkészített hálószoba (ágynemű zárt zsákokban, hozzáférhető ágykörnyezet).',
  'IMG-PREP-02': 'Kezelés utáni szellőztetés: nyitott ablak a kezelt szobában.',
  'IMG-PREP-03': 'Ágynemű zárt zsákban, mosásra előkészítve.',
  'IMG-IPM-05': 'Utóellenőrzés a kezelés után (az ágy/monitor ellenőrzése a helyszínen).',
  'IMG-IPM-06': 'Szerkezeti rés vagy repedés, amely búvóhely lehet (közelkép, méretarány).',
  'IMG-IPM-SEAL-01': 'Falrepedés az ágy mellett.', 'IMG-IPM-SEAL-02': 'Rés a szegélyléc mögött.',
  'IMG-B2B-04': 'A takarítószemélyzet ellenőrzőlistája használat közben (anonim, apartmanban).',
  'IMG-INS-02': 'Az ágykeret illesztéseinek átvizsgálása lámpával.', 'IMG-INS-03': 'Az ágykeret csavarfuratainak átvizsgálása.', 'IMG-INS-04': 'A fejtámla hátoldalának átvizsgálása.',
  'IMG-INS-01': 'Matracvarrat átvizsgálása zseblámpával, a kéz és a lámpa látszik (30–40 cm-ről).',
  'IMG-INS-05': 'Kanapévarratok / a kanapé alsó részének átvizsgálása.',
  'IMG-IPM-01': 'A tulajdonos dolgozik egy hálószobában (felderítés vagy kezelés közben), a környezet is látszik.',
  'IMG-IPM-03': 'Egyedi kezelési terv/ellenőrzőlap a ténylegesen használt eszközökkel (ügyféladat nélkül).',
  'IMG-IPM-04': 'Monitorozó csapda az ágy lába alatt.',
  'IMG-B2B-01': 'Turisztikai apartman hálószobája a felderítés közben.',
  'IMG-B2B-02': 'Szálláshely-szoba átvizsgálása.',
  'IMG-PREV-02': 'Az ágy ellenőrzése szálláshelyre érkezéskor.',
  'IMG-LOC-ALC-01': 'Saját városkép Alicanteról (fekvő, ≥ 2400 px, ismert helyen).', 'IMG-LOC-BEN-01': 'Saját városkép Benidormról.', 'IMG-LOC-TOR-01': 'Saját városkép Torreviejáról.', 'IMG-LOC-CAL-01': 'Saját városkép Calpéról.', 'IMG-LOC-ALT-01': 'Saját városkép Alteáról.',
  'IMG-LOC-ALC-02': 'Egy ténylegesen kezelt vagy bemutató lakás hálószobája (ügyféladat nélkül).',
  'IMG-ENT-ADU-01': 'Kifejlett poloska makró, vonalzóval/érmével a képen, fajmeghatározás szakember által.',
  'IMG-ENT-ADU-02': 'Kifejlett hím poloska dorzális nézetben, makró, vonalzóval.',
  'IMG-ENT-ADU-03': 'Éhes (nem táplált) kifejlett poloska makró, vonalzóval.',
  'IMG-ENT-ADU-04': 'Táplált és éhes egyed egymás mellett (összehasonlítás).',
  'IMG-ENT-SCALE-01': 'Egy poloska vonalzó (mm) vagy érme mellett — méretarányos azonosító kép.',
  'IMG-ENT-EGG-01': 'Izolált peték makró, vonalzóval.', 'IMG-ENT-EGG-02': 'Petecsoport illesztésben vagy varratban.',
  'IMG-ENT-NYM-01': 'Első stádiumú nimfa makró, vonalzóval.', 'IMG-ENT-NYM-02': 'Második stádiumú nimfa.', 'IMG-ENT-NYM-03': 'Harmadik stádiumú nimfa.', 'IMG-ENT-NYM-04': 'Negyedik stádiumú nimfa.', 'IMG-ENT-NYM-05': 'Ötödik stádiumú nimfa.',
  'IMG-ENT-MOU-02': 'Izolált levedlett kültakaró makróban.',
  'IMG-ENT-EXC-01': 'Ürüléknyomok matracvarratban (közelkép).',
  'IMG-ENT-HID-03': 'Poloskák bútorillesztésben.', 'IMG-ENT-HID-04': 'Poloskák a fejtámla mögött.', 'IMG-ENT-HID-05': 'Poloskák fal és szegélyléc sarkában.', 'IMG-ENT-HID-06': 'Poloskák kárpitozott kanapén.',
  'IMG-CHEM-01': 'A ténylegesen használt vegyszeres kijuttató eszközök kirakva (a hidegködképzőt a végleges típusválasztás után).', 'IMG-CHEM-02': 'Hátpermetező / lándzsa célzott kezelés közben.', 'IMG-CHEM-05': 'Az ágykeret kezelése.', 'IMG-CHEM-06': 'Szegélyléc / rodapié kezelése.',
  'IG-07': 'Tipikus búvóhelyek egy hálószobában (infografika).', 'IG-08': 'A matrac és az ágykeret átvizsgálási pontjai (infografika).', 'IG-09': 'A poloskák behurcolásának útjai (infografika).', 'IG-14': 'Kezelési technológiák összehasonlítása (infografika).', 'IG-16': 'Réslezárás: mit javasolnak a források (infografika).',
};
const orient = id => { const e = ctx.images[id], [w, h] = e.aspect; if (e.kind === 'infographic') return 'infografika 16:9 (SVG)'; if (e.role === 'document') return 'fekvő 4:3 (dokumentum)'; return h > w ? 'álló 4:5' : `fekvő ${w}:${h}`; };
const own = id => ctx.images[id].kind === 'infographic' ? 'Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani)' : ctx.images[id].role === 'document' ? 'Saját dokumentum (szkennelve/fotózva)' : /^IMG-ENT/.test(id) ? 'Saját makrófotó (vonalzóval)' : 'Saját fotó (valós munka)';
const prio = id => /^P[01]$/.test(ctx.images[id].priority) ? 'KÖTELEZŐ' : 'Opcionális';

// ---- A: empty slots on the pages
const A = new Map();
for (const p of Object.values(ctx.pages)) {
  const L = p.es; let section = 'Oldal teteje (hero)';
  const add = (id, where) => { const e = ctx.images[id]; if (!e || e.status === 'ready') return; const k = `${p.id}|${where}|${prio(id)}`; (A.get(k) || A.set(k, { page: p, section: where, prio: prio(id), ids: [] }).get(k)).ids.push(id); };
  if (L.heroImage) add(L.heroImage, 'Oldal teteje (hero)');
  for (const b of L.blocks || []) {
    if (b.h2) section = b.h2;
    if (b.type === 'figure') add(b.image, section);
    if (b.type === 'infographic' && !ctx.infographics[b.id]) add(b.id, section);
    if (b.type === 'gallery' || b.type === 'docs') for (const im of [...(b.images || []), ...((b.groups || []).flatMap(g => g.images))]) add(im, b.h2 || section);
  }
}
const rowsA = [...A.values()].sort((a, b) => a.page.id.localeCompare(b.page.id) || (a.prio === b.prio ? 0 : a.prio === 'KÖTELEZŐ' ? -1 : 1));
const cell = ids => ids.map(i => `**${i}**: ${HU[i] || ctx.images[i].alt.es}`).join('<br>');
const kinds = ids => [...new Set(ids.map(orient))].join(' / ');
const owns = ids => [...new Set(ids.map(own))].join(' / ');
const tableA = rowsA.map(r => `| ${r.page.id} · ${r.page.es.h1} (\`${r.page.es.url}\`) | ${r.section} | ${r.ids.length} | ${cell(r.ids)} | ${kinds(r.ids)} | ${owns(r.ids)} | ${r.prio} |`).join('\n');
const nReq = rowsA.filter(r => r.prio === 'KÖTELEZŐ').reduce((t, r) => t + r.ids.length, 0), nOpt = rowsA.filter(r => r.prio !== 'KÖTELEZŐ').reduce((t, r) => t + r.ids.length, 0);
const nPhotoReq = rowsA.filter(r => r.prio === 'KÖTELEZŐ' && !r.ids.some(i => i.startsWith('IG-'))).reduce((t, r) => t + r.ids.length, 0);

// ---- B: pictures in place that are NOT own on-site documentation (replace or clear rights)
const B = [];
for (const p of Object.values(ctx.pages)) {
  const L = p.es; let section = 'Oldal teteje (hero)';
  const chk = (id, where) => { const e = ctx.images[id]; if (e?.status === 'ready' && e.provenance && e.provenance !== 'own') B.push({ p, where, id, prov: e.provenance }); };
  if (L.heroImage) chk(L.heroImage, 'Oldal teteje (hero)');
  for (const b of L.blocks || []) { if (b.h2) section = b.h2; if (b.type === 'figure') chk(b.image, section); if (b.type === 'gallery') for (const im of b.images || []) chk(im, b.h2 || section); }
}
const provTxt = { illustration: 'Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg', unverified: 'Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg' };
const tableB = B.map(r => `| ${r.p.id} · ${r.p.es.h1} | ${r.where} | ${r.id} | ${HU[r.id] || ''} | ${provTxt[r.prov]} |`).join('\n');

// ---- C: planned own photos that have no slot on a page yet
const C = new Map();
for (const line of readFileSync(new URL('../docs/seo/PAGE-IMAGE-MAP.csv', import.meta.url), 'utf8').split(/\r?\n/).slice(1)) {
  const c = line.split(','); const [page, section, id] = c; const status = c[6], pr = c[7];
  if (!/^PG-/.test(page) || !id?.startsWith('IMG-') || status === 'EXISTING (protected)' || proc[id] || !/^P[01]$/.test(pr) || !ctx.pages[page]) continue;
  if (JSON.stringify(ctx.pages[page]).includes('"' + id + '"')) continue;
  const k = `${page}|${section}`; (C.get(k) || C.set(k, { page, section, ids: [] }).get(k)).ids.push(id);
}
const tableC = [...C.values()].map(r => `| ${r.page} · ${ctx.pages[r.page].es.h1} | ${r.section} | ${r.ids.length} | ${r.ids.map(i => `**${i}**: ${HU[i] || ctx.images[i]?.alt.es}`).join('<br>')} |`).join('\n');

const used = Object.entries(proc).map(([id, d]) => `| ${id} | ${d.aliasOf ? '(ugyanaz a fájl mint ' + d.aliasOf + ')' : d.variants.base} | ${d.provenance || '-'} | ${ctx.images[id].caption.es} |`).join('\n');

writeFileSync(new URL('../docs/seo/MISSING-IMAGES.md', import.meta.url), `# MISSING-IMAGES — hiányzó és cserélendő képek (automatikusan generált)

Generálva: \`node tools/build-missing-images-doc.mjs\` (a jelenlegi oldaladatokból és képmanifestből). Frissíteni kell minden képátadás után.
Szabályok: nem használunk stockfotót, és nem generálunk képet; a fotókat a tulajdonos adja. Fényképet **csak** a „Saját fotó” sorokhoz kell biztosítani.

## A. Üres képhelyek az oldalakon (${nReq} kötelező, ${nOpt} opcionális)
**KÖTELEZŐ** = P0/P1: a publikálást blokkolja (a production build megtagadja). **Opcionális** = P2/P3: a production build **kihagyja** a hiányzó képet, az oldal nem blokkolt; előnézetben placeholder látszik. Ebből ${nPhotoReq} kötelező kép fotó/dokumentum, a többi infografika (SVG) lenne, de azok mind opcionálisak.

| Oldal neve | Szekció | Hiányzó képek száma | Pontosan milyen képre van szükség | Tájolás és képarány | Saját vagy generált kép | Prioritás |
|---|---|---|---|---|---|---|
${tableA}

## B. Már beillesztett, de nem saját helyszíni dokumentációnak minősülő képek
Ezek a képek a helyükön vannak és kiírt (illusztráció / semleges) felirattal jelennek meg; nem blokkolnak, de a hitelesség miatt saját fotóra cserélendők, ill. a jogaikat tisztázni kell.

| Oldal | Szekció | Képazonosító | Mit ábrázol a javasolt saját fotó | Státusz |
|---|---|---|---|---|
${tableB}

## C. Tervezett további saját fotók (még nincs képhely az oldalon; a beérkezéskor illesztjük be)
| Oldal | Tervezett szekció | Darab | Pontosan milyen képre van szükség |
|---|---|---|---|
${tableC}

## D. Beillesztett képek jegyzéke
| Képazonosító | Fájlnév (alap) | Eredet | Képaláírás (ES) |
|---|---|---|---|
${used}
`);
console.log(`MISSING-IMAGES.md written: A=${nReq} required + ${nOpt} optional slots, B=${B.length} replace/clear, C=${[...C.values()].reduce((t, r) => t + r.ids.length, 0)} planned`);
