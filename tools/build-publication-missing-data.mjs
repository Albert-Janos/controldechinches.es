// Writes docs/seo/PUBLICATION-MISSING-DATA.md (Hungarian): THE single central list of everything that is still missing before the
// remaining pages / image slots are complete.  Generated from the page data, the image manifest and the image inventory.
//   node tools/build-publication-missing-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { makeContext } from './build.mjs';
import { parseCsv } from './lib/csv.mjs';

const ctx = makeContext({ mode: 'preview', pageDirs: ['data/pages'] });
const inv = Object.fromEntries(parseCsv(readFileSync(new URL('../docs/seo/IMAGE-ASSET-INVENTORY.csv', import.meta.url), 'utf8')).map(r => [r.asset_id, r]));
const live = p => ctx.site.indexableStatuses.includes(p.status);
const ratio = a => { const [w, h] = a; const r = w / h; return Math.abs(r - 1.5) < .06 ? '3:2' : Math.abs(r - 4 / 3) < .06 ? '4:3' : Math.abs(r - 16 / 9) < .06 ? '16:9' : Math.abs(r - .8) < .06 ? '4:5 (álló)' : `${w}:${h}`; };
const WHY = {
  'IMG-ENT-MOU-02': 'Nincs egyedi, vonalzós vedlésfotó az átadott anyagban; az atlasz többi része ettől függetlenül teljes.',
  'IMG-ENT-EXC-01': 'Nincs közeli, vonalzós ürülékfotó matracvarratból az átadott anyagban.',
  'IMG-ABOUT-04': 'Nincs fotó, amelyen a tulajdonos matracvarratot vizsgál.', 'IMG-ABOUT-08': 'Nincs fotó a vizsgálati leletek dokumentálásáról.',
  'IMG-ABOUT-09': 'Nincs fotó az eszközök előkészítéséről.', 'IMG-ABOUT-10': 'Nincs további természetes munkakörnyezeti portré.',
  'IMG-CRED-04': 'Tulajdonosi döntés (2026-11-27): a magyar képesítési/nyilvántartási okmányok egyelőre nem jelennek meg.', 'IMG-CRED-06': 'Tulajdonosi döntés: további tanúsítvány nem kötelező.',
  'IMG-PREV-01': 'Nincs csomag-/poggyászellenőrzésről készült kép.', 'IMG-PREP-02': 'Nincs szellőztetést mutató kép.', 'IMG-PREP-03': 'Nincs zsákolt ágynemű-kép.', 'IMG-B2B-04': 'Nincs takarítószemélyzeti ellenőrzőlistás kép.',
};
const rows = [];
for (const p of Object.values(ctx.pages)) {
  const L = p.es; let section = 'oldal teteje (hero)';
  const add = (id, where) => { const e = ctx.images[id]; if (!e || e.status === 'ready') return; rows.push({ p, id, e, where }); };
  if (L.heroImage) add(L.heroImage, 'hero');
  for (const b of L.blocks || []) {
    if (b.h2) section = b.h2;
    if (b.type === 'figure') add(b.image, section);
    if (b.type === 'infographic' && !ctx.infographics[b.id]) add(b.id, section);
    if (b.type === 'gallery' || b.type === 'docs') for (const im of [...(b.images || []), ...((b.groups || []).flatMap(g => g.images))]) add(im, b.h2 || section);
  }
}
const prio = pr => pr === 'P0' || pr === 'P1' ? 'ajánlott (magas)' : pr === 'P2' ? 'ajánlott' : 'opcionális';
const line = r => {
  const { p, id, e, where } = r, ig = e.kind === 'infographic', pageTag = live(p) ? 'ÉLES (indexelhető)' : 'Draft (noindex)';
  return `| ${p.id} · ${p.es.h1} · \`${p.es.url}\` (EN: \`${p.en.url}\`) · ${pageTag} | ${r.where} | \`${id}\` — ${inv[id]?.content || e.alt?.es || ''} | 1 | ${ig ? 'Infografika (SVG, ábra)' : 'Fénykép'} | ${ig ? 'Szakmailag ellenőrzött illusztráció (fejlesztői feladat, forrásból vett adatokkal)' : /^IMG-(LOC|B2B|PREV|PREP)/.test(id) ? 'Saját fotó (illusztráció is elfogadható „Ilustración” felirattal)' : 'Saját fotó'} | ${ig ? '16:9' : ratio(e.aspect)} | ${ig ? 'ajánlott' : prio(e.priority)} (nem blokkoló) | ${WHY[id] || (ig ? 'Még nincs megrajzolva; entomológiai/forrás-ellenőrzés kell.' : 'Nincs ilyen kép az átadott anyagban.')} |`;
};
const atlasIds = new Set(ctx.pages['PG-070'].es.blocks.find(b => b.type === 'gallery').groups.flatMap(g => g.images));
const aiRows = Object.values(ctx.images).filter(e => e.status === 'ready' && e.provenance === 'ai');
const aiList = aiRows.map(e => `| \`${e.id}\` | ${e.alt?.es} | ${Object.values(ctx.pages).filter(p => JSON.stringify(p.es).includes(`"${e.id}"`) || JSON.stringify(p.es).includes(`"heroImage":"${e.id}"`)).map(p => p.id + (live(p) ? '' : ' (draft)')).join(', ') || '—'} | ${atlasIds.has(e.id) ? 'Valódi, ellenőrzött makrófotó (vonalzóval, entomológus által azonosítva)' : 'Saját fotó, ha készül'} |`).join('\n');
const stock = Object.values(ctx.images).filter(e => e.status === 'ready' && e.provenance === 'unsplash').map(e => `\`${e.id}\``).join(', ');
const unpublished = Object.values(ctx.pages).filter(p => !live(p));
const REASON = {
  'PG-010': 'LGL-01 (spanyolországi működési feltételek); árakat mutat (ÁFA-kapu)', 'PG-011': 'LGL-01; szakmai lektor; IPM-lépések jogi/hatósági tartalma', 'PG-012': 'LGL-01; szakmai lektor', 'PG-013': 'LGL-01, LGL-04; árat mutat; HPMed/kazánhőmérséklet nyitott', 'PG-014': 'LGL-05 (biocid termékek, nyilvántartási számok, SDS, visszalépési idők); árat mutat', 'PG-015': 'LGL-06 (B2B dokumentáció, ígéretek)',
  'PG-016': 'LGL-01/07 (spanyol működési státusz, a magyar képesítés elismerése); a portré és a bemutatkozás kész', 'PG-020': 'LGL-01/08; kiszállási szabály, kiindulási település nincs meghatározva', 'PG-021': 'LGL-01/08; árat mutat', 'PG-022': 'LGL-01/08; árat mutat', 'PG-023': 'LGL-01/08; árat mutat',
  'PG-030': 'Árakat mutat (ÁFA-kapu); a válaszok a szolgáltatási területtől/elérhetőségtől függnek (#3)', 'PG-072': 'Az űrlapmezők és a dokumentumok adminisztratív mezői nincsenek véglegesítve (LGL-06)', 'PG-072A': 'Az űrlapmezők nincsenek jóváhagyva (LGL-06)', 'PG-072B': 'A naplóoszlopok nincsenek jóváhagyva (LGL-06)', 'PG-073': 'Nincs valós, írásos hozzájárulással publikálható eset (LGL-10) — az oldal magától sem indexelhető',
};
const unpubRows = unpublished.map(p => `| ${p.id} | ${p.es.h1} | \`${p.es.url}\` · \`${p.en.url}\` | ${REASON[p.id] || '—'} |`).join('\n');

writeFileSync(new URL('../docs/seo/PUBLICATION-MISSING-DATA.md', import.meta.url), `# PUBLICATION-MISSING-DATA — mi hiányzik még (egyetlen központi lista)

Generálva: \`node tools/build-publication-missing-data.mjs\` (oldaladatokból, képmanifestből és az inventoryból). Frissítve: 2026-11-28.

**Alapelv (tulajdonosi döntés, D-045):** egyetlen hiányzó kép sem blokkolja a publikálást; a hiányzó kép **nem jelenik meg**, nincs üres képhely, a szekció kép nélkül, szövegesen áll. Az alábbi képek tehát *pótlandók*, nem *kötelezők*.

## A. Hiányzó képek — oldalanként és szekciónként
(${rows.length} még üres képhely. A „Draft” oldalak képhelyei csak akkor számítanak, ha az oldal publikálásra kerül.)

| Oldal | Szekció | Hiányzó elem | Db | Típus | Saját fotó vagy illusztráció kell | Ajánlott képarány | Kötelező vagy ajánlott | Miért hiányzik |
|---|---|---|---|---|---|---|---|---|
${rows.map(line).join('\n')}

### A.1. Az atlasz (PG-070) állapota
- **29 fotóhely közül 27 kitöltve** (12 saját fotó, 14 jelölt AI-illusztráció, 1 Unsplash-fotó); **hiányzik: 2 fotó** (\`IMG-ENT-MOU-02\`, \`IMG-ENT-EXC-01\`) és **2 infografika** (\`IG-04\` fajazonosítás, \`IG-06\` méretösszehasonlítás).
- Mind a 8 kategória és mind a 8 szűrő megvan; a teljes soronkénti lista: \`docs/seo/ATLAS-IMAGE-LIST.md\`.

### A.2. Jelenleg AI-illusztrációként szereplő képek — saját/valódi fotóra cserélendők (ajánlott, nem blokkoló)
Az illusztrációk mindig „Ilustración … No es una fotografía propia” felirattal állnak; az atlasz 14 makrójának vonalzója illusztratív (nem mér), a stádium/nem/faj nem ellenőrzött. Ha ezek valójában valódi saját fotók, jelezd, és \`provenance: own\`-ra állítjuk.

| Képazonosító | Mit ábrázol | Oldalak | Mire cserélendő |
|---|---|---|---|
${aiList}

### A.3. Unsplash-fotók (neutrális felirat, nem saját munka)
${stock}. A város- és szálláshely-képek nem saját munkák; a makrófotó (\`IMG-ENT-ADU-01\`) skála nélküli — a valódi, vonalzós saját makrófotó jobb lenne.

## B. Oldalak, amelyek még Draft/noindex státuszban vannak (nem kerülnek a production csomagba)
| ID | Oldal | URL (ES · EN) | Miért nem publikálható még |
|---|---|---|---|
${unpubRows}

**Hogyan lesz belőlük éles oldal:** az adott \`data/pages/PG-xxx.json\` \`status\` értéke \`Approved for indexing\` lesz, a belső „Pendiente del propietario” blokk törlődik, a \`dates\` kitöltődik, majd \`npm run package\` + \`validate\`. A build addig megtagadja az árat mutató oldalt, amíg a \`data/prices.json\` \`vat.status\` nem \`approved\`.

## C. Nem képhez kötött hiányzó adatok (tulajdonosi / jogi)
| Adat | Hol kell | Kapu |
|---|---|---|
| Titulár/cégnév, NIF/CIF, cím, e-mail, nyilvántartás (az **élő** aviso legal és adatvédelmi oldal még \`[PENDIENTE]\` mezőket mutat) | \`aviso-legal.html\`, \`politica-privacidad.html\`, JSON-LD | LGL-03 |
| Spanyolországi működési státusz, ROESB, a magyar képesítés elismerése | PG-010…016, 020…023 | LGL-01/07 |
| Biocid termékek: név, hatóanyag, nyilvántartási szám, SDS, visszalépési idő | PG-014, GYIK | LGL-05 |
| IVA-kulcs és fogyasztói ármegjelenítés jóváhagyása (spanyol hivatalos forrás + könyvelő) | minden árat mutató oldal | LGL-02 |
| Kiszállás kiindulási települése és távolságfüggő díj | PG-020…023, GYIK | #3 |
| Független szakmai lektor (ha lesz, a cikkeken megjelenik) | PG-040…062 | #20 |
| Mérési azonosítók (GA4, Ads), cookie-leltár | \`js/measurement-config.js\`, adatvédelmi oldal | LGL-03 |
| Az élő főoldal (15 település) és az élő JSON-LD (3) szinkronja a 18 jóváhagyott településsel | \`index.html\` | tulajdonosi jóváhagyás (védett oldal) |
`);
console.log(`PUBLICATION-MISSING-DATA.md written (${rows.length} open image slots, ${unpublished.length} unpublished pages)`);
