// Writes docs/seo/ATLAS-IMAGE-LIST.md (Hungarian): ONE ROW PER planned atlas image (existing and missing), straight from the PG-070 page data
// + image manifest.  Missing images are never rendered on the public page; this list is their registry.   node tools/build-atlas-image-list.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { makeContext } from './build.mjs';
import { parseCsv } from './lib/csv.mjs';

const ctx = makeContext({ mode: 'preview', pageDirs: ['data/pages'] });
const proc = JSON.parse(readFileSync(new URL('../data/images-processed.json', import.meta.url), 'utf8'));
const assign = parseCsv(readFileSync(new URL('../data/images-assign.csv', import.meta.url), 'utf8'));
const atlas = ctx.pages['PG-070'].es.blocks.find(b => b.type === 'gallery');

const MACRO = '4:3 (vagy 3:2) fekvő; legalább 2400 px a hosszabb oldalon, ajánlott 3000–4000 px (a feldolgozás 1600 px-ig méretez, a nagyításhoz tartalék kell)';
const FIELD = '4:3 (vagy 3:2) fekvő; legalább 2000 px a hosszabb oldalon';
const SCI = 'Saját makrófotó VAGY jogtiszta tudományos fotó (egyetemi/extension forrás, CC/közkincs licenc, forrásmegjelöléssel); a nemet, stádiumot és fajt szakember (entomológus) igazolja; AI-generált kép NEM megengedett';
const OWNF = 'Saját fotó (valós fertőzöttség; hely/dátum és személyes adat nélkül)';
const NYM = (n, mm) => ({ cat: 'Ninfák (5 stádium)', what: `${n}. stádiumú ninfa, a vonalzó mellett`, show: `Az egész test éles; a test mérete a vonalzón (≈ ${mm} mm); alsó/oldal- vagy hátnézet`, bio: 'Áttetsző, sárgásfehér, szárnyatlan test; 3 pár láb; a potroh szelvényezése; táplálás után a belseje vörös lehet; a stádiumot a méret és az előző vedlések alapján szakember határozza meg', res: MACRO, src: SCI });
const SPEC = {
  'IMG-ENT-ADU-01': { cat: 'Kifejlett egyedek', what: 'Kifejlett poloska oldalnézetben, szöveten (nőstény vagy nem meghatározott, táplált állapot)', show: 'Az egész test, a fej, a pronotum és a potroh éles', bio: 'Lapos, ovális test; vörösesbarna szín (táplálás után vörösesebb, megnyúltabb); 3 pár láb; 4 ízű csáp; összetett szemek; a pronotum alakja; a potroh szelvényei és szegélye', res: MACRO, src: SCI + '. A meglévő kép Unsplash-fotó, skála nélkül: cserélendő' },
  'IMG-ENT-ADU-02': { cat: 'Kifejlett egyedek', what: 'Kifejlett HÍM, hátnézetben (dorzális), vonalzóval', show: 'A potroh vége jól látszik', bio: 'A hím potrohvége keskenyebb, hegyesebb (a nőstényé kerekebb); lapos ovális test, pronotum, fej és csáp; a nemet szakember igazolja', res: MACRO, src: SCI },
  'IMG-ENT-ADU-03': { cat: 'Kifejlett egyedek', what: 'Táplálkozás előtti (éhes) kifejlett egyed, vonalzóval', show: 'A test vékonysága és színe', bio: 'Lapos, „papírvékony”, világosabb barna test; a potroh nem duzzadt és nem vörös; a nem (hím/nőstény) megadva', res: MACRO, src: SCI },
  'IMG-ENT-ADU-04': { cat: 'Kifejlett egyedek', what: 'Táplált és éhes egyed ugyanazon a képen, egymás mellett, vonalzóval', show: 'A méret-, szín- és alakkülönbség közvetlenül összehasonlítható', bio: 'A táplált egyed megnyúlt, vörösebb, duzzadt potrohú; az éhes lapos és barna; mindkettő azonos nézetben', res: MACRO, src: SCI },
  'IMG-ENT-ADU-05': { cat: 'Kifejlett egyedek (fajazonosítás)', what: 'A fej és a pronotum részletképe felülnézetből, vonalzóval', show: 'A fej és a pronotum teljes körvonala, a szemek', bio: 'A pronotum szélessége és oldalszegélyének alakja, a fej–pronotum arány, a szőrzet; a Cimex lectularius és a C. hemipterus megkülönböztetéséhez; a határozást entomológus erősíti meg', res: MACRO, src: SCI },
  'IMG-ENT-SCALE-01': { cat: 'Méretarány', what: 'Egy kifejlett poloska mm-beosztású vonalzó vagy érme mellett', show: 'A vonalzó beosztása és a poloska teste is éles', bio: 'A test hossza leolvasható (≈ 5–7 mm); a poloska és a vonalzó azonos síkban', res: MACRO, src: SCI },
  'IMG-ENT-SCALE-02': { cat: 'Méretarány', what: 'Valamennyi fejlődési stádium egy képen vonalzón: pete, 1–5. nimfa, felnőtt', show: 'A méretnövekedés sorrendben', bio: 'Pete ≈ 1 mm; nimfák ≈ 1,5; 2; 2,5; 3; 4,5 mm; felnőtt ≈ 5–7 mm; a stádiumok szakember által ellenőrzött sorrendben', res: MACRO, src: SCI },
  'IMG-ENT-EGG-01': { cat: 'Peték', what: 'Izolált peték, vonalzóval', show: 'Néhány pete éles, egymástól elkülönülve', bio: 'Kb. 1 mm hosszú, gyöngyfehér, megnyúlt ovális pete; kb. 5 nap után szemfolt látszhat', res: MACRO, src: SCI },
  'IMG-ENT-EGG-02': { cat: 'Peték', what: 'Petecsoport varratban vagy illesztésben, vonalzóval', show: 'A peték elhelyezkedése a búvóhelyen', bio: 'Egymáshoz és a felülethez tapadt, gyöngyfehér peték; a hely (varrat, fa illesztés) is felismerhető', res: MACRO, src: SCI },
  'IMG-ENT-EGG-03': { cat: 'Peték (kikelt)', what: 'Kikelt peték üres burkai, vonalzóval', show: 'Az üres, kikelt burkok jól elkülönülnek a teli petéktől', bio: 'Áttetsző, üres burok, a tetején megnyílt (fedélnyílásos) kikelési hasadékkal; mellette ép peték összehasonlításra, ha van', res: MACRO, src: SCI },
  'IMG-ENT-NYM-01': NYM(1, '1,5'), 'IMG-ENT-NYM-02': NYM(2, '2'), 'IMG-ENT-NYM-03': NYM(3, '2,5'), 'IMG-ENT-NYM-04': NYM(4, '3'), 'IMG-ENT-NYM-05': NYM(5, '4,5'),
  'IMG-ENT-MOU-01': { cat: 'Vedlett kültakarók', what: 'Vedlett kültakarók (exuviák) textilen', show: 'A vedlett héjak tömege', bio: 'Sárgásbarna, üres, áttetsző héjak; a testalak megőrződött', res: FIELD, src: OWNF },
  'IMG-ENT-MOU-02': { cat: 'Vedlett kültakarók', what: 'Egyetlen levedlett kültakaró makróban, vonalzóval', show: 'A héj teljes alakja', bio: 'Áttetsző, halványsárga, üres héj; a hátoldali hasadás, amelyen a nimfa kibújt; a lábak és csápok héja', res: MACRO, src: SCI },
  'IMG-ENT-EXC-01': { cat: 'Ürüléknyomok', what: 'Ürüléknyomok matracvarratban közelről, vonalzóval', show: 'A foltok mérete, eloszlása a varrat mentén', bio: 'Apró, sötét (fekete–barna) pontok, csoportokban; nedves ujjal szétkenhetők (az emésztett vér foltja)', res: MACRO, src: OWNF },
  'IMG-ENT-EXC-02': { cat: 'Ürüléknyomok', what: 'Ürülék- és vedlésnyomok fehér lakkozott felületen', show: 'A foltok eloszlása a felületen', bio: 'Sötét pöttyök és világosabb héjdarabok szétszórva', res: FIELD, src: OWNF },
  'IMG-ENT-HID-01': { cat: 'Természetes búvóhelyek', what: 'Poloskák a fertőzött matrac varratában', show: 'A varrat, a poloskák és nyomaik', bio: 'Egyedek különböző stádiumban, vedlések és ürülék a szegélyvarrat mentén', res: FIELD, src: OWNF },
  'IMG-ENT-HID-02': { cat: 'Természetes búvóhelyek', what: 'Poloskák az ágyrács léceinek illesztéseinél', show: 'Az illesztések és a rajtuk lévő nyomok', bio: 'Egyedek, vedlések és ürülék a faillesztések résében', res: FIELD, src: OWNF },
  'IMG-ENT-HID-03': { cat: 'Természetes búvóhelyek', what: 'Poloskák bútorillesztésben (pl. fiókvezető, láb)', show: 'Az illesztés és a benne lévő egyedek', bio: 'Résben megbújó egyedek, ürülék- és vedlésnyomok', res: FIELD, src: OWNF },
  'IMG-ENT-HID-04': { cat: 'Természetes búvóhelyek', what: 'Poloskák a fejtámla mögött / hátoldalán', show: 'A fejtámla és a fal közötti rés', bio: 'Egyedek és nyomok a fejtámla illesztésein', res: FIELD, src: OWNF },
  'IMG-ENT-HID-05': { cat: 'Természetes búvóhelyek', what: 'Poloskák fal és szegélyléc sarkában', show: 'A sarok, a rés és a nyomok', bio: 'Egyedek és ürüléknyomok a szegélyléc mentén', res: FIELD, src: OWNF },
  'IMG-ENT-HID-06': { cat: 'Természetes búvóhelyek', what: 'Poloskák kárpitozott kanapé varratában', show: 'A varrat és a rajta látható nyomok', bio: 'Egyedek, vedlések, ürülék a kárpit varratában', res: FIELD, src: OWNF },
  'IMG-SEV-01': { cat: 'Fertőzöttség súlyossága: kezdeti', what: 'Kezdődő fertőzöttség: néhány egyed és elszórt foltok egy matracvarraton', show: 'A varrat és a kevés nyom', bio: 'Pár egyed és néhány ürülékfolt egyetlen búvóhelyen; vedlés alig látszik', res: FIELD, src: OWNF },
  'IMG-SEV-02': { cat: 'Fertőzöttség súlyossága: mérsékelt', what: 'Mérsékelt fertőzöttség: több gócpont a matracon és az ágyráccsal együtt', show: 'Több búvóhely egy képen', bio: 'Egyedek különböző stádiumban, vedlések és ürülék több helyen, de még összefüggő tömegek nélkül', res: FIELD, src: OWNF },
  'IMG-IPM-02': { cat: 'Fertőzöttség súlyossága: előrehaladott', what: 'Előrehaladott fertőzöttség: sötét foltok a falon az ágy fölött', show: 'A fal és a foltok eloszlása', bio: 'Ürüléknyomok szétszóródva több felületen', res: FIELD, src: OWNF },
  'IMG-INS-06': { cat: 'Fertőzöttség súlyossága: extrém', what: 'Extrém fertőzöttség: nagy tömeg a padlón és a bútor szélén', show: 'A tömeg és a hely', bio: 'Sok egyed, vedlés és ürülék nyílt felületeken', res: FIELD, src: OWNF },
  'IG-04': { cat: 'Fajazonosítás (infografika)', what: 'A Cimex lectularius és a C. hemipterus megkülönböztetése', show: 'Fej és pronotum összehasonlítva', bio: 'A pronotum alakja és oldalszegélye, a fej–pronotum arány', res: '16:9 SVG (nem fotó)', src: 'Szakmailag ellenőrzött illusztráció (SVG, entomológiai ellenőrzéssel; fejlesztői feladat)' },
  'IG-06': { cat: 'Összehasonlítás (infografika)', what: 'Az ágyi poloska mérete más rovarokhoz képest (bolha, kullancs, szőnyegbogár stb.)', show: 'Méretarányos összehasonlítás', bio: 'A forrásokból vett méretek és megkülönböztető jegyek', res: '16:9 SVG (nem fotó)', src: 'Szakmailag ellenőrzött illusztráció (SVG, forrásból vett méretekkel; fejlesztői feladat)' },
};

const ids = [...atlas.groups.flatMap(g => g.images), 'IG-04', 'IG-06'];
const rawOf = id => { const a = assign.find(r => r.asset_id === id && r.approved === 'yes'); return a ? a.file.split('/').pop() : ''; };
const rows = ids.map(id => {
  const s = SPEC[id]; if (!s) throw new Error('no spec for ' + id);
  const d = proc[id], have = !!d, e = ctx.images[id];
  const file = have ? `${d.variants.base}-{${d.variants.widths.join(',')}}.${d.variants.formats.join('/')} (forrás: ${rawOf(id)})` : '';
  const st = have ? (/^IMG-ENT-ADU-01$/.test(id) ? 'MEGLÉVŐ (Unsplash, skála nélkül)' : /^IMG-ENT-(MOU|EXC|HID)|^IMG-(IPM|INS)/.test(id) ? 'MEGLÉVŐ (saját fotó, skála nélkül)' : 'MEGLÉVŐ') : 'HIÁNYZIK';
  return { id, have, line: `| ${id} | ${s.cat} | ${s.what} | ${s.show} | ${s.bio} | 1 | ${s.res} | ${st} | ${file} | ${s.src} |` };
});
const photos = rows.filter(r => !r.id.startsWith('IG-')), missing = photos.filter(r => !r.have), have = photos.filter(r => r.have);
const byCat = {}; for (const g of atlas.groups) byCat[g.id] = g.images;

writeFileSync(new URL('../docs/seo/ATLAS-IMAGE-LIST.md', import.meta.url), `# ATLAS-IMAGE-LIST — a fotóatlasz (PG-070) teljes képlistája

Automatikusan generálva: \`node tools/build-atlas-image-list.mjs\` (a PG-070 oldaladatokból és a képmanifestből). **Minden tervezett képhely külön sor.** A hiányzó képek a publikus oldalon nem jelennek meg (nincs üres képhely vagy helyőrző), de itt és az adatokban nyilvántartottak; a kategóriák, a szűrők és a szöveges szakmai tartalom viszont végig látszanak. Egyetlen hiányzó kép sem blokkolja a publikálást, a pótlás fokozatos.

## Összesítés
- **Jelenleg az atlasz ${have.length} képet tartalmaz** (${have.filter(r => r.id === 'IMG-ENT-ADU-01').length} Unsplash-fotó, ${have.length - have.filter(r => r.id === 'IMG-ENT-ADU-01').length} saját fotó), ezek egyike sem tartalmaz mérőskálát.
- **Tervezett képtípusok összesen: ${photos.length} fotó + ${rows.length - photos.length} infografika = ${rows.length}**, ${Object.keys(byCat).length} kategóriában (kifejlett egyedek, méretarány, peték és kikelt burkok, 5 nimfastádium, vedlések, ürüléknyomok, búvóhelyek, súlyossági fokozatok) + fajazonosítás és összehasonlítás (infografika).
- **Még biztosítandó új fotó: pontosan ${missing.length}** (a felsorolt sorok, mind külön). A 2 infografika tervezése fejlesztői feladat (entomológiai ellenőrzéssel), nem kell hozzá fotót biztosítani.
- Ajánlott csere (nem számít a ${missing.length}-be): az \`IMG-ENT-ADU-01\` Unsplash-képe és a skála nélküli saját fotók skálás/ellenőrzött változatra cserélhetők.
- Az eredeti terv 24 atlaszképhelyet tartalmazott (22 az oldaladatban + \`ADU-05\` és \`SCALE-02\` az inventoryban) és 2 infografikát (IG-04, IG-06); a képcsomagból 2 meglévő képet (\`INS-06\`, \`IPM-02\`) a súlyossági csoportba soroltam; újonnan, a tulajdonos kérésére felvéve: \`IMG-ENT-EGG-03\` (kikelt peték), \`IMG-SEV-01\`, \`IMG-SEV-02\` (súlyossági fokozatok).

## Mi került ki korábban, és mi lett visszaállítva
| Elem | Korábban (a képcsomag utáni állapot) | Most |
|---|---|---|
| Kategóriák a publikus oldalon | A „Huevos”, „Ninfas” csoport fejléce és szűrőgombja el volt rejtve (csak a 4 fényképes csoport látszott) | Mind a 8 kategória látszik, szakmai szöveggel |
| Szűrősor | 4 gomb (Adultos, Mudas, Excrementos, Escondites) | 8 gomb: Adultos, Escala, Huevos, Ninfas, Mudas, Excrementos, Escondites, Gravedad |
| Oldaladat (képcsoportok, azonosítók) | Érintetlen volt (22 képazonosító) | Bővítve: ${ids.length - 2} képazonosító + 2 infografika, súlyossági csoporttal |
| Lead és meta description | Átírva („valós fertőzöttségi fotók”, az azonosítási szempontok és a fázisok kiemelése nélkül) | Visszaállítva a teljes tartalomra (adultos, huevos, 5 ninfa, mudas, excrementos, escondites, gravedad), „fotók és jegyzetek” megfogalmazással |
| Kategória-szövegek | Nem voltak | Új, forrásokkal (EPA, Virginia Tech, UC IPM, La Rioja) alátámasztott szakmai bevezetők kategóriánként (ES/EN) |
| Fajazonosítás, hasonló rovarok | Nem látszott (az infografika-helyek rejtve) | Szöveges szakasz + IG-04, IG-06 infografika-helyek (megjelennek, ha elkészülnek) |
| Hiánylista | Az egyszerűsített listában 17 atlasz-kép „egyelőre kihagyva” | Ez a lista: minden hiányzó kép külön sor |
| Forráslista az oldalon | Nem volt | 4 forrás (ES/EN) |

## Képlista (egy sor = egy kép)
| Képazonosító | Kategória | Pontosan milyen képre van szükség | Mit kell jól láthatóan ábrázolnia | Milyen biológiai és anatómiai jellemzőknek kell látszaniuk | Szükséges darabszám | Képarány és ajánlott felbontás | Meglévő vagy hiányzó | Meglévő fájlnév | Saját fotó, jogtiszta tudományos fotó vagy szakmailag ellenőrzött illusztráció szükséges |
|---|---|---|---|---|---|---|---|---|---|
${rows.map(r => r.line).join('\n')}

## Megjegyzések
- Minden makrófotón legyen mm-beosztású vonalzó vagy érme **a képen belül**; a fókusz-egyeztetés (focus stacking) vagy kis rekesz miatt a pronotum, a szemek és a potrohszelvények élesek; semleges háttér; csak expozíció/kontraszt/élesítés szerkeszthető, objektumot eltávolítani vagy hozzáadni tilos (IMAGE-STRATEGY, IMAGE-REQUIREMENTS §3).
- A fejlődési stádiumot, a nemet, a táplált/éhes állapotot és a fajt **szakember vagy megbízható határozókulcs** igazolja, nem képfelismerő AI. Amíg ez nincs meg, a felirat nem tüntet fel nemet/stádiumot/fajt.
- A súlyossági fokozatok az atlasz leíró besorolásai (nem hivatalos skála); a fotók valós fertőzöttségekről készüljenek, hely- és dátumadat nélkül, személyes adat nélkül.
- Anatómiailag pontatlan, AI-generált rovarképet nem használunk. Új képet nem generálunk és nem töltünk le.
`);
console.log(`ATLAS-IMAGE-LIST.md written: ${photos.length} photo rows (${have.length} existing, ${missing.length} missing) + ${rows.length - photos.length} infographics`);
