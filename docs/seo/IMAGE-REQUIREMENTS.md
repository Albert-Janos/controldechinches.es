# IMAGE-REQUIREMENTS — képigény és -követelmények

Részletes képbrief minden URL-re: `PAGE-IMAGE-MAP.csv` (oldal, szekció, kép-ID, szerep, mobil kivágás, státusz, prioritás, SEO-fájlnév, ES/EN alt és képaláírás) + `IMAGE-ASSET-INVENTORY.csv` (kép-szintű mezők: cél, mit ábrázol, felbontás, tájolás, arány, jogok, adatvédelem, szakmai ellenőrzés). Itt csak a **közös** követelmények.

## 1. Oldaltípus szerinti képigény (összefoglaló)

| Oldaltípus | Hero | Tartalmi képek | Ábra | Kötelező szerzői portré |
|---|---|---|---|---|
| Rólam (T-D) | saját portré (fekvő) | életút, gép, felszerelés, munka | – | igen |
| IPM (T-B+) | felderítés/kezelés közben | búvóhely, terv, monitor, utóellenőrzés, szerkezeti rés | IG-01, IG-14, IG-15 | igen |
| Szolgáltatás (T-B) | tényleges kezelés | gép, részlet, felhasználási területek | IG-14 | igen |
| Lokális (T-A) | helyi saját fotó | helyi ingatlantípus, valós helyi munka *ha van* | – | igen |
| Tudásközpont-cikk (T-C) | téma-fotó | részletfotók, azonosító képek | oldalanként 1–2 IG | igen |
| Atlasz (T-G) | adult makró | 20–35 makró + búvóhely-fotók | IG-04, IG-06 | igen |
| B2B (T-E) | alojamiento-felderítés | protokoll, dokumentum | IG-10, IG-13 | igen |
| Esettanulmány (T-F) | valós esetfotó | előtte/közben/utóellenőrzés | – | igen |

## 2. Általános technikai követelmény
Fekvő tájolás az alapértelmezett (portré csak az `ABOUT-02`, `ABOUT-03`); minimum **2400 px hosszú oldal** (hero és részlet), 2000 px (dokumentum, illusztráció); eredeti: JPEG/HEIC/RAW; fókuszált, nem túlexponált, semleges háttér; nincs digitális zoom; kitakart GPS/EXIF a publikus verzióban.

## 3. Makrófotó-követelmény (atlasz, életciklus)
- **Méretarány** minden azonosító képen (vonalzó mm-skálával vagy érme, a képen belül).
- **Fókusz-egyeztetés** (focus stacking vagy kis rekesz): a pronotum, a szemek és a potroh szelvényei élesek.
- **Fehér/semleges háttér** + oldalnézet/hátnézet; a természetes állapot (búvóhelyen) külön képen.
- A fejlődési stádiumot (1–5. nimfastádium), a nemet, az éhezett/táplált állapotot és a fajt (*Cimex lectularius* / *C. hemipterus*) **entomológiai szakember vagy megbízható határozókulcs** igazolja, nem képfelismerő AI.
- Szerkesztés: csak expozíció/kontraszt/élesítés; objektumot eltávolítani vagy hozzáadni tilos (IMAGE-STRATEGY §2).

## 4. Kezelés- és munkafotók
Biztonságos, szakszerű munkavégzést mutassanak (védőfelszerelés, szabályos technika); ügyfél-azonosításra alkalmas részlet nélkül. Ha a fotó nem valós megbízásból készült („bemutató”), a képaláírás ezt jelzi („demostración con material propio”).

## 5. Jóváhagyási lánc
Tulajdonos (felvétel, jog, hozzájárulás) → szakmai ellenőrzés (makró, azonosítás, kezelés-technika) → technikai optimalizálás (IMAGE-SEO-SPEC) → oldalba építés. Státusz: `IMAGE-ASSET-INVENTORY.csv` `owner_approval`, `professional_review_status`.
