# CONTENT-BRIEFS — brief-formátum és első körös oldalak

A brief a szerkesztő számára írja le, **mit kell tudni egy oldal megírása előtt**. Egy oldalnak csak akkor készül szövege, ha a brief minden **kötelező** mezője kitöltött és a tulajdonosi bemenet megvan. Az oldal-szintű adatok (szándék, kulcsszó, title/H1, szekciók, linkek): `PAGE-INVENTORY.csv`. Itt a mezők és az első körös (P2–P5) oldalak specifikus kiegészítései.

## 1. Brief-sablon (minden oldalhoz)
| Mező | Tartalom |
|---|---|
| Oldal-ID, sablon, nyelv | PG-xxx · T-x · ES/EN |
| Szándék + elsődleges kulcsszó | `KEYWORD-URL-MAP.csv` |
| Egyértelmű rövid válasz (2–4 mondat) | ✍ szerkesztő |
| Kötelező szakmai tények | lista + **forrás** (cím, kiadó, év, URL, ellenőrzés dátuma) |
| Tulajdonosi bemenet (OWNER-INPUT) | kérdés-ID-k, **hiányzó = blokkoló** |
| Szekciók és H2/H3 | PAGE-INVENTORY + PAGE-TEMPLATES |
| Képek / infografikák | PAGE-IMAGE-MAP (ID-k) |
| Belső linkek | INTERNAL-LINKING |
| CTA-intenzitás | CONVERSION-MEASUREMENT §CTA |
| Tiltott állítások | CONTENT-STANDARDS §3 + oldal-specifikus |
| Szakmai ellenőr | név/szerep (csak ha tényleges) |
| ES/EN eltérő fókusz | MULTILINGUAL-SEO |
| Státusz | LEGAL-PUBLICATION-GATES státuszlánc |

## 2. Specifikus briefek (P2–P3 oldalak)

### PG-016 /sobre-mi/ — bemutatkozó
Rövid válasz: *Ki dolgozik a Control de Chinches mögött, milyen igazolt képesítéssel és módszerrel.* Kötelező: igazolt megnevezés, végzettség, nyilvántartás (ha publikálható), eszközök, módszer. **Tiltott:** spanyol működési jogosultság sugallása, nem adott tapasztalat. Blokkoló bemenet: AUTHOR-AND-CREDENTIALS §4 (#13–#24). ES hang: tegező, tényszerű. EN fókusz: expat/turista vendég, magyarországi képesítés tisztázása röviden.

### PG-011 /servicios/control-integrado/ — IPM/GIP
Rövid válasz: *Mi az integrált kezelés és miben tér el az egyszeri kezeléstől.* Kötelező: IPM-METHODOLOGY 23 lépés + szerep-táblázat; **állításkorlát** a rés-lezárásra; források (EPA, hatósági). Blokkoló: #7–#12. Különbség a PG-049-től: 011 = a *saját módszer*; 049 = *általános útmutató hogyan irtható*.

### PG-013 /servicios/vapor-seco/ — szárazgőz
Rövid válasz: *Mit tud és mit nem a szárazgőzös kezelés, milyen felületeken alkalmazható.* Kötelező: **valós gép-típus**, gyártói adatok (max. gőzhőmérséklet, nyomás — *kimeneti* érték ≠ felületi hőmérséklet), kezelhető/nem kezelhető felületek, korlát: nem ér el minden búvóhelyet. Tiltott: „100% hatékony”, „kémia nélkül mindig elég”. Blokkoló: #8–#9 (gép, beállítások). A főoldali „vapor seco komplementario” megfogalmazással **összhang** (ne mondjunk ellent az Ads-oldalnak; jelezd az eltérést, ha van).

### PG-014 /servicios/tratamiento-quimico/
Rövid válasz: *Mikor indokolt a célzott vegyszeres kezelés, és hogyan védjük a lakókat.* Kötelező: **ténylegesen használt, Spanyolországban engedélyezett termékek** (hatóanyag-kategória; terméknév/adagolás csak LGL-05 után), visszalépési idő *a termék utasítása szerint*, szellőztetés, gyerekek/háziállatok. Tiltott: adagolás-útmutató lakosságnak, „veszélytelen”. A főoldal „tratamiento químico combinado” névvel ULV-t jelöl — **terminológia-egyeztetés** (D-014 jelölt).

### PG-012 /servicios/inspeccion-diagnostico/
Rövid válasz: *Mit nézünk meg, hogyan jutunk fertőzöttségi értékeléshez.* Blokkoló: önálló szolgáltatás-e vagy a kezelés része; ár.

## 3. Cikk-briefek (első hullám, PG-041, 042, 044, 045, 047, 049, 050, 053, 055, 056)
Közös: T-C; 1 hero-fotó/ábra, ≥ 3 ellenőrzött forrás, szerzői blokk, 1 szolgáltatás-link. Egyedi pontok:
- **041 jelek:** rövid válasz = *3 leggyakoribb jel + „csípés önmagában nem bizonyít”*; ellenőrzőlista (IG-08); linkek 045, 044, atlasz, identificador.
- **042 csípés:** orvosi korlát; ne mutasson diagnosztikus „mintát”; bolha/egyéb összehasonlítás táblázatban; ne használjuk a meglévő `signo-picaduras` képet.
- **044/045 búvóhely/matrac:** 8–10 konkrét ellenőrzési pont, saját fotókkal (INS-01…).
- **047 behurcolás:** poggyász, használt bútor, utazás; IG-09; ne állítson „bizonyítottan” egyetlen forrást.
- **049 hogyan irtható:** kezelési módszerek áttekintése (gőz, vegyszer, kombinált) → PG-011/013/014; „mi nem működik” szekció (051 előfutára).
- **050 gőz:** hőmérséklet-küszöb vs. gép-kimeneti hőmérséklet különválasztva; források: hatósági/egyetemi + gyártó; korlátok.
- **053 miért térnek vissza:** okok listája (rejtett búvóhelyek, szomszéd egység, újrabehurcolás, hiányos kezelés); nincs „szolgáltató hibáztatása”.
- **055/056 előkészítés/utána:** ellenőrzőlista (IG-11/12); a *tényleges* utasítás a tulajdonosé; visszalépési idő termék/módszer szerint; **nem** általános „2 óra” szám.

## 4. Szöveg-jelleg és címsor-minták
H1: szándék-alapú, természetes („¿Cómo saber si tengo chinches de cama?”); H2: kérdés- vagy tény-alapú; rövid bekezdések (≤ 4 mondat); felsorolás csak valódi listához; a „profesional” helyett konkrétum (végzettség, eszköz, módszer).

## 5. EN-fókusz (eltérő, nem fordítás)
„Bed bug treatment Costa Blanca”, „holiday let”, „what to do if you find bed bugs on holiday”, UK/IE kifejezések (flat, holiday let), fogalmak magyarázata (pl. *ROESB* nem szükséges az EN olvasónak, de a hitelesség igen).
