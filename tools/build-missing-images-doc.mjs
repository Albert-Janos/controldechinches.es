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

Frissítve: 2026-11-27 (a tulajdonos döntései alapján). **Egyetlen hiányzó kép sem blokkolja a publikálást, és sehol nem jelenik meg üres képhely vagy helyőrző**: ahol nincs kép, a szekció kép nélkül, szövegesen jelenik meg. Nem generálunk és nem töltünk le új képet; a meglévő anyagból gazdálkodunk.

## 1. Ténylegesen kérhető új képek (összesen **3** egyedi kép, mindhárom ajánlott, nem blokkoló)
Csak olyan kép szerepel, amely valódi szakmai vagy vizuális értéket ad, és a meglévő anyagból nem pótolható.

| Oldal neve | URL | Szekció | Szükséges darabszám | Pontosan mit ábrázoljon | Tájolás és képarány | Saját vagy generált kép | Prioritás |
|---|---|---|---|---|---|---|---|
| Szakmai bemutatkozás (Sobre mí) | \`/sobre-mi/\` · EN: \`/en/about/\` | Oldal teteje (hero) | 1 | Munkaruhás saját portré: derékig/mellkasig, természetes fényben, rendezett háttérrel, a tekintet a kamerába. (Addig a meglévő portré marad.) | Fekvő, 3:2 (legalább 2400 px széles) | Saját fotó | Ajánlott (nem blokkoló) |
| Szárazgőzös kezelés | \`/servicios/vapor-seco/\` · EN: \`/en/services/dry-steam/\` | „Hogyan működik a módszer” (Cómo funciona el método) | 1 | Matracvarrat gőzölése: a fúvóka a matrac szegélyvarrásán, a gőz látszik, a matrac szövete jól látható; háttérben nincs ügyfél-azonosító adat. A videó és a meglévő fotók ezt nem mutatják. | Fekvő, 3:2 | Saját fotó | Ajánlott (nem blokkoló) |
| Felderítés és diagnosztika | \`/servicios/inspeccion-diagnostico/\` · EN: \`/en/services/inspection-diagnosis/\` | Oldal teteje (hero) | 1 | A matrac átvizsgálása lámpával: zseblámpa a matracvarraton, a kéz és a lámpa látszik (30–40 cm-ről). Jelenleg AI-illusztráció szerepel „Ilustración” felirattal; a saját fotó ezt váltaná ki (ugyanez a kép a „Matrac” cikk tetején is áll). | Fekvő, 3:2 | Saját fotó | Ajánlott (csere, nem blokkoló) |

**Összesen: 3 új, egyedi kép** a szolgáltatási és bemutatkozó oldalakhoz. Ha ezek nem érkeznek meg, a weboldal ugyanígy publikálható. A fotóatlasz **22 további fotója** külön listán van (\`ATLAS-IMAGE-LIST.md\`), fokozatos pótlásra.

### Miért nem kérünk többet (újraértékelt tételek)
| Korábban tervezett | Döntés | Indok |
|---|---|---|
| Dokumentálás munka közben | nem kérjük | A valós fertőzöttségi fotók (6 db) és a fotódokumentáció pótolják |
| Eszközök előkészítése | nem kérjük | A Polti-gép saját fotója, a vegyszeres/hidegköd saját fotók és a felszerelést mutató illusztráció elegendők |
| Utóellenőrzés | nem kérjük | Nincs rá szükség a szakmai tartalomhoz; a „Miért tér vissza” oldal fejképe valós, súlyos fertőzöttség |
| Rejtett búvóhely / repedés | nem kérjük | A 6. valós fotó (sérült fal, ágy körüli nyomok) a „Rések és repedések” oldal fejképe |
| Okmányok: CRED-01/02/03 (magyar képesítés, nyilvántartás) | **kihagyva** | A tulajdonos döntése: a spanyol elismeréshez szükséges dokumentáció még készül; nincs megjelenítés |
| CRED-04 további tanúsítvány | nem szükséges | A Lantra „Bed Bug Control” tanúsítvány marad (kód elfedve) |
| Fotóatlasz (PG-070): hím/nőstény, éhes/táplált, 5 nimfastádium, peték és kikelt burkok, vedlés, ürülék, vonalzós makrók, búvóhelyek, súlyossági fokozatok | **VISSZAÁLLÍTVA, nem kihagyva** | A teljes atlaszterv él (8 kategória, szűrők, szakmai szöveg); a 22 hiányzó atlaszfotó külön, soronként: \`ATLAS-IMAGE-LIST.md\` (nem blokkoló, fokozatosan pótolható; a 3 kért kép mellett) |
| 27 opcionális képhely (P2/P3) és az infografika-helyek | nem foglalkozunk velük | Nem jelennek meg, nem blokkolnak |

## 2. Beillesztett képek (${real.length} fájl, ${Object.keys(proc).length} képazonosító) és a videó
Eredet: ${nOwn} saját fotó/dokumentum, ${nAi} AI-illusztráció, ${nUns} Unsplash-kép. A besorolás a tulajdonos megerősítésén alapul (három forrás: Unsplash, AI-generált, saját); hogy a nem saját fájlok közül melyik AI és melyik Unsplash, a fájl megjelenéséből következtettem — kérem, javítsa, ha téves (a felirat és a nyilvántartás egy sorban módosítható: \`tools/fill-image-assignments.mjs\`).

| Képazonosító | Fájlnév (alap) | Forrás | Hol szerepel | Képaláírás (ES) |
|---|---|---|---|---|
${rows}
| (videó) | vapor-seco-cabezal-polti-sofa-infestado.webm + poster | Saját videó (magyarországi munka) | Szárazgőzös kezelés (ES/EN) | Vídeo corto, sin audio: el cabezal de vapor Polti junto a un sofá con una infestación real. |

## 3. Képforrások és felhasználási jog
- **Unsplash:** kereskedelmi felhasználásra szolgál, forrásmegjelölés nem kötelező (a szerzőt nem rögzítettük). Felismerhető személyek közeli képe nem használható; az Altea-fotó ezért kimaradt.
- **AI-illusztrációk:** mindig „Ilustración … No es una fotografía propia” felirattal; saját helyszíni dokumentációként nem szerepelnek.
- **Saját fotók és videó:** magyarországi munkák; **nem** szerepelnek spanyolországi esetként, hely/dátum/kezelési eredmény/ügyféltörténet nincs megadva; a felismerhető személyes adatokat kitakartuk (tanúsítvány-kód), a fertőzöttségi fotók tartalmát nem módosítottuk. Nem használt: \`hidekodkepzes-munka-kozben.webp\` (családi fényképek látszanak a vitrinben).
`);
console.log('MISSING-IMAGES.md written');
