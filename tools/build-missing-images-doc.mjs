// Writes docs/seo/MISSING-IMAGES.md (Hungarian): the SHORT list of photos that would still add real value, plus what was placed and where it
// comes from.  Rules (owner, 2026-11-27): a missing photo is never a publication blocker, no empty placeholders are rendered, nothing is
// generated or downloaded.  Re-run after every image delivery:  node tools/build-missing-images-doc.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { makeContext } from './build.mjs';

const ctx = makeContext({ mode: 'preview', pageDirs: ['data/pages'] });
const proc = JSON.parse(readFileSync(new URL('../data/images-processed.json', import.meta.url), 'utf8'));
const NAME = { 'PG-011': 'Integrált kártevőirtás (IPM)', 'PG-012': 'Felderítés és diagnosztika', 'PG-013': 'Szárazgőzös kezelés', 'PG-014': 'Vegyszeres kezelés', 'PG-015': 'Szálláshelyek: megelőzés és monitorozás', 'PG-016': 'Szakmai bemutatkozás', 'PG-020': 'Szolgáltatási területek', 'PG-021': 'Alicante (városi oldal)', 'PG-022': 'Benidorm (városi oldal)', 'PG-023': 'Torrevieja (városi oldal)', 'PG-041': 'Hogyan ismerd fel az ágyi poloskát', 'PG-043': 'Az ágyi poloska életciklusa', 'PG-044': 'Hol bújnak meg az ágyi poloskák', 'PG-045': 'Ágyi poloska a matracban', 'PG-048': 'Utazás és szállodák', 'PG-049': 'Hogyan irtható az ágyi poloska', 'PG-053': 'Miért tér vissza az ágyi poloska', 'PG-059': 'Rések és repedések lezárása', 'PG-060': 'Monitorozás', 'PG-061': 'Szálláshelyi protokoll', 'PG-070': 'Fotóatlasz', 'PG-073': 'Valós esetek / fertőzöttségi fotók' };
const SRC = { own: 'Saját fotó (magyarországi munka)', ai: 'AI-generált illusztráció', unsplash: 'Unsplash fotó' };
const pageOf = id => { const out = []; for (const p of Object.values(ctx.pages)) if (JSON.stringify(p.es).includes(`"${id}"`)) out.push(p.id); return out; };

const rows = Object.entries(proc).filter(([, d]) => !d.aliasOf).map(([id, d]) => {
  const e = ctx.images[id], also = Object.entries(proc).filter(([, x]) => x.aliasOf === id).map(([k]) => k);
  const pages = [...new Set([id, ...also].flatMap(pageOf))].map(p => `${NAME[p] || p}`).join(', ');
  return `| ${[id, ...also].join(' + ')} | ${d.variants.base} | ${SRC[d.provenance] || d.provenance} | ${pages || '-'} | ${e.caption.es} |`;
}).join('\n');
const real = Object.entries(proc).filter(([, d]) => !d.aliasOf), nOwn = real.filter(([, d]) => d.provenance === 'own').length, nAi = real.filter(([, d]) => d.provenance === 'ai').length, nUns = real.filter(([, d]) => d.provenance === 'unsplash').length;

writeFileSync(new URL('../docs/seo/MISSING-IMAGES.md', import.meta.url), `# MISSING-IMAGES — egyszerűsített képhiánylista

Frissítve: 2026-11-28 (4. munkacsomag: új saját képek, atlasz-illusztrációk, munkaruhás portré). **Egyetlen hiányzó kép sem blokkolja a publikálást, és sehol nem jelenik meg üres képhely vagy helyőrző**: ahol nincs kép, a szekció kép nélkül, szövegesen jelenik meg. A meglévő anyagból gazdálkodunk; új képet nem generálunk és nem töltünk le.

## 1. Mi hiányzik még
**A teljes, oldalankénti és szekciónkénti hiánylista (képek + egyéb publikálási adatok): \`docs/seo/PUBLICATION-MISSING-DATA.md\`** — ez az egyetlen központi lista; itt csak az összefoglaló áll.
- Az atlaszból **2 fotó** hiányzik (IMG-ENT-MOU-02, IMG-ENT-EXC-01) és **2 infografika** (IG-04, IG-06); az atlasz 14 makrója jelenleg **jelölt AI-illusztráció**, valódi, ellenőrzött fotóra cserélendő (ajánlott, nem blokkoló).
- A többi képhely (szakmai bemutatkozás galéria, bizonyítványok, cikkek infografikái, hero-képek) szintén nem blokkol: a hiányzó kép nem jelenik meg.

### Miért nem kérünk többet (újraértékelt tételek)
| Korábban tervezett | Döntés | Indok |
|---|---|---|
| Dokumentálás munka közben | nem kérjük | A valós fertőzöttségi fotók és a fotódokumentáció pótolják |
| Eszközök előkészítése | nem kérjük | A Polti-gép, a vegyszeres/hidegköd saját fotók elegendők |
| Utóellenőrzés | nem kérjük | Nincs rá szükség a szakmai tartalomhoz |
| Okmányok: CRED-01/02/03 (magyar képesítés, nyilvántartás) | **kihagyva** | A tulajdonos döntése: a spanyol elismeréshez szükséges dokumentáció még készül; nincs megjelenítés |
| CRED-04 további tanúsítvány | nem szükséges | A Lantra „Bed Bug Control” tanúsítvány marad (kód elfedve) |
| Fotóatlasz (PG-070) | **teljes terv él** | 8 kategória, 8 szűrő, szakmai szöveg, forráslista; soronkénti lista: \`ATLAS-IMAGE-LIST.md\` |
| Opcionális képhelyek (P2/P3) és infografika-helyek | nem blokkolnak | Nem jelennek meg |

### A 4. munkacsomagban (2026-11-28) feldolgozott, de NEM használt nyers képek
| Nyers fájl | Ok |
|---|---|
| \`12-uj-sajat/20260616_200148.jpg\` | Olvasható biocid-terméknév a címkén (LGL-05: terméknév nem publikálható) |
| \`12-uj-sajat/20251206_093321.jpg\` | Redundáns a CHEM-07-tel; lakásbelső, bekeretezett képek |
| \`12-uj-sajat/20260330_150107.jpg\` | Redundáns (DRY-05 / DRY-04: gőzfej faágykereten) |
| \`12-uj-sajat/20261029_130223.jpg\` | Életlen, kesztyű és ruházat takarja; a HID-06 tisztábban mutatja ugyanazt |
| \`12-uj-sajat/20261106_120442.jpg\` | Gyakorlatilag azonos az IMG-ENT-EXC-02 képpel (ugyanaz a fejtámla, ugyanaz a szög) |
| \`12-uj-sajat/20261110_135134.jpg\` | 265×199 px bélyegkép, lakásbelső |
| \`10-varosok/altea.avif\`, \`04-vegyszeres/hidekodkepzes-munka-kozben.webp\` | Korábbi döntés (felismerhető személyek / családi fényképek) |

## 2. Beillesztett képek (${real.length} fájl, ${Object.keys(proc).length} képazonosító) és a videó
Eredet: ${nOwn} saját fotó/dokumentum, ${nAi} AI-illusztráció, ${nUns} Unsplash-kép. A besorolás a tulajdonos megerősítésén alapul (három forrás: Unsplash, AI-generált, saját); hogy a nem saját fájlok közül melyik AI és melyik Unsplash, a fájl megjelenéséből következtettem — kérem, javítsa, ha téves (a felirat és a nyilvántartás egy sorban módosítható: \`tools/fill-image-assignments.mjs\`).

| Képazonosító | Fájlnév (alap) | Forrás | Hol szerepel | Képaláírás (ES) |
|---|---|---|---|---|
${rows}
| (videó) | vapor-seco-cabezal-polti-sofa-infestado.webm + poster | Saját videó (magyarországi munka) | Szárazgőzös kezelés (ES/EN) | Vídeo corto, sin audio: el cabezal de vapor Polti junto a un sofá con una infestación real. |

## 3. Képforrások és felhasználási jog
- **Unsplash:** kereskedelmi felhasználásra szolgál, forrásmegjelölés nem kötelező (a szerzőt nem rögzítettük). Felismerhető személyek közeli képe nem használható; az Altea-fotó ezért kimaradt.
- **AI-illusztrációk:** mindig „Ilustración … No es una fotografía propia” felirattal; saját helyszíni dokumentációként nem szerepelnek. Az atlasz 14 makrója (ADU-02…05, EGG-01…03, NYM-01…05, SCALE-01…02) az 1448×1086 / 1536×1024 PNG formátum alapján AI-generált; a vonalzójuk illusztratív, a stádium/nem/faj nem ellenőrzött. **Ha valódi saját fotók, jelezd, és \`provenance: own\`-ra állítjuk.**
- **Saját fotók és videó:** magyarországi munkák; **nem** szerepelnek spanyolországi esetként, hely/dátum/kezelési eredmény/ügyféltörténet nincs megadva; a felismerhető személyes adatokat kitakartuk (tanúsítvány-kód), a fertőzöttségi fotók tartalmát nem módosítottuk. Nem használt: \`hidekodkepzes-munka-kozben.webp\` (családi fényképek látszanak a vitrinben).
`);
console.log('MISSING-IMAGES.md written');
