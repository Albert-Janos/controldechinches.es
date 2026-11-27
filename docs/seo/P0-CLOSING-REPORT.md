# P0 LEZÁRÓ JELENTÉS — Control de Chinches SEO Master Project

Dátum: 2026-11-27 · Ág: `claude/control-chinches-seo-master-8bac65` · Baseline: `3c4f9f6`
**Státusz: P0 kész, megállok a tulajdonosi jóváhagyási pontnál.** A P0 alatt a weboldal fájljait, képeit, CSS-ét, JS-ét, trackingjét, az AI-diszpécsert nem módosítottam, nem publikáltam, nem deployoltam. Egyetlen változás: új `docs/seo/` mappa (45 tervezési dokumentum + ez a jelentés).

> **Őszinte korlátok.** (1) A keresési adatokhoz nem volt Keyword Planner/GSC/Ads/GA4 hozzáférésem → **nincs keresési volumen**. (2) A keresőeszköz amerikai szerverű: a konkurens-SERP **nem spanyolországi lokalizációjú**, a versenytárs-oldalakat nem auditáltam mélyen. (3) Lighthouse/axe nem futott → teljesítmény- és a11y-baseline **nem igazolt**. (4) A jogi pontok kockázat-azonosítások, **nem jogi tanács**.

---

## 1. Jelenlegi rendszer állapota
- Kézzel írt statikus HTML (8 oldal), 1 közös CSS, kis natív JS; Apache/cPanel; **nincs build, preview, CI**; 1 git-commit. Az élő oldal a repóval egyezik.
- 6 indexelhető URL (ES/EN főoldal, árak, apartmanok), kölcsönös hreflang, egyedi title/description/canonical, jó redirectek (non-www/http → https://www egy lépésben), valódi 404, gzip, biztonsági fejlécek (HSTS ki).
- Konverzió: WhatsApp (elsődleges) + telefon (AI-asszisztens); `data-cta` eseménykód kész, de **a mérési ID-k üresek** (élőben is).
- A teljes audit: `CURRENT-STATE-AUDIT.md`.

## 2. Ellenőrzött technikai hibák
| ID | Súly | Lényeg |
|---|---|---|
| **A-C1** | **Kritikus** | **ES árak oldal ellentmond önmagának és a többi oldalnak:** „insecticida desde 139 €” + „vapor seco desde 150 €” vs. Esencial 139 € / Completo 239 € / vapor +80 €/hálószoba (főoldal, EN, kalkulátor). |
| **A-C2** | **Kritikus** | **JS-hiba az ES árak oldalon (élő konzol):** `landing.js` rádiócsoportot keres, ami az ES HTML-ben nincs → kezdeti kalkulátor-frissítés nem fut; a WhatsApp-gomb alapesetben üzenet nélküli. (Hatás kattintásos teszttel igazolandó.) |
| **A-C3** | **Kritikus** | Aviso legal: titulár, NIF, cím, e-mail, nyilvántartás `[PENDIENTE]`, „borrador… antes de iniciar la actividad” — közben az oldal élesben árat és „¡Incluso hoy!” foglalást kínál. |
| A-H1…H5 | Magas | üres mérési ID-k; nincs preview/staging; képek eredete/joga nincs dokumentálva; gőzfotón nem Polti gép látszik; sürgősségi CTA jogi státuszig kockázatos. |
| A-M1…M12 | Közepes | minimális JSON-LD; külső Google Fonts; HSTS ki; régi sablon és törött `og:image`; nehéz favicon; vegyes URL-minta; szolgáltatási terület 3 helyen 3 változat; „profesional” túlhasználat; EN hívás spanyol asszisztensre; stb. |

## 3. SEO-lehetőségek
Az indexelhető felület 6 URL: nincs szolgáltatás-, város-, tudás-, B2B- és szerzői hitelesség-tartalom. Legnagyobb potenciál: **szakmai hitelesség személyhez kötve**, saját fotóatlasz, átlátható IPM-módszertan, EN-lefedettség, B2B-dokumentáció, nyilvános árak már megvannak (kalkulátor).

## 4. Konkurenciaelemzés fő eredményei (`COMPETITOR-ANALYSIS.md`)
Rentokil (országos): település-sablonos városoldalak + tudásoldalak + ISO-hitelesség; Anticimex: hőkezelés „insekticid nélkül” kommunikáció; Habitissimo: település-listák és ár-útmutató (100–400 €, átlag 2 kezelés); helyi cégek általános kártevőirtók; Costa Blanca Habitat: EN-referral; hiteles közforrások: EPA, La Rioja, Madrid, Umivale, Generalitat. **Rések (ellenőrzendő):** saját azonosító fotóatlasz, átlátható IPM-módszertan, szárazgőz-vegyszer őszinte összevetés, EN specializált tartalom, szálláshely-protokoll, személyhez kötött hitelesség.

## 5. Kulcsszókutatás eredményei és hiányzó adatok (`KEYWORD-RESEARCH.md`)
22 szándék-klaszter, 74 kulcsszó-hozzárendelés (`KEYWORD-URL-MAP.csv`), kannibalizáció-szabályok. **Hiányzik: minden keresési volumen és nehézség (`UNVERIFIED`).** Teendő: `KEYWORD-PLANNER-IMPORT.csv` feltöltése Keyword Plannerbe (Spanyolország; ES és EN lista), Ads search-terms export, GSC (ha van).

## 6. Javasolt teljes weboldalstruktúra (`SITE-ARCHITECTURE.md`)
6 meglévő URL érintetlen + **47 új oldalpár** (ES+EN, ~94 URL) fázisokban: szolgáltatások (hub + 4 + B2B program), Rólam, szerkesztői szabályzat, zónák (hub + 3 + 4), GYIK, tudásközpont (hub + 25 cikk), atlasz, azonosító, dokumentumok, esettanulmányok.
**Eltérések a mestertervtől (jóváhagyásra):** `/precios.html` marad (nem `/precios/`), a meglévő apartman-URL marad, `/contacto/` nem készül, `/metodologia/` = IPM-oldal, a 11 szolgáltatás-aloldalból 5 oldal + szekciók, nincs 8 ügyféltípus-oldal, 3. hullámú városok nincsenek tervezve.

## 7. Javasolt aloldalak
Teljes lista, szándék, kulcsszó, title/H1 ES+EN, szekciók, képek, források, jogi feltétel, státusz: **`PAGE-INVENTORY.csv`** (30 mező, 51 sor).

## 8. Keresési szándék szerinti prioritások
1) Védett tranzakciós oldalak (érintetlen) → 2) hitelesség (Rólam) + szolgáltatás/IPM (tranzakciós-szakmai) → 3) lokális (Alicante, Benidorm, Torrevieja) → 4) GYIK + 10 első hullámú cikk → 5) atlasz/azonosító/dokumentumok → 6) B2B és esettanulmány → 7) 2. hullám városok/cikkek. A tranzakciós oldalak éles publikálása **jogi kapuhoz kötött**.

## 9. Vizuális koncepció (`VISUAL-DESIGN-SYSTEM.md`)
Meglévő arculat tokenjei (sötétkék, sárga CTA, DM Sans), szakmai dokumentum-érzet, kevesebb kártya, nincs gradiens/árnyék/animáció, erős tipográfia, külön `seo.css` (`.sx-`), a `site.css` érintetlen.

## 10. Oldalsablonok
9 sablon (T-A lokális, T-B szolgáltatás/IPM, T-C cikk, T-D bemutatkozó, T-E B2B, T-F esettanulmány, T-G atlasz, T-H hub, T-I azonosító) szekció-listával: `PAGE-TEMPLATES.md`; desktop/mobil wireframe: `DESKTOP-MOBILE-WIREFRAMES.md`.

## 11. Személyes szakmai márka terve (`AUTHOR-AND-CREDENTIALS.md`)
`/sobre-mi/`: portré, életút, igazolt végzettségek + nagyítható, kitakart dokumentumgaléria, eszközök, IPM-szemlélet, alapelvek; közös szerzői komponens minden szakmai oldalon; **a magyar képesítés nem állítható spanyol működési engedélynek**.

## 12. IPM-rendszer terve (`IPM-METHODOLOGY.md`)
Egyetlen `/servicios/control-integrado/` oldal: 23 lépés, négy szakmai cél külön (aktív kezelés, behurcolás-megelőzés, búvóhely-csökkentés, terjedés-mérséklés), **szerep-táblázat** (tulajdonos végzi / javaslat / külső kivitelező), IG-01 folyamatábra, korlát: a rés-lezárás nem szünteti meg a fertőzést és nem garantálja a megelőzést. A „Ténylegesen elvégzi” oszlopot Te töltöd ki.

## 13. Meglévő felhasználható képek (13 elem; `IMAGE-ASSET-INVENTORY.csv`)
Eredet/jog **egyiknél sincs dokumentálva**. Vizuális benyomás (nem bizonyíték): generáltnak tűnik a főoldali hero, a `signo-picaduras`, az `apartamento-mediterraneo`, a térkép; fotószerű, forrás ismeretlen: `chinche-macro`, `signo-manchas`, `signo-sangre`, `signo-mudas`; valószínűleg saját: `irtas-gozzel01`, `permetezes…`. **Legértékesebbek (ha igazolod, hogy sajátok vagy jogtiszták):** `signo-manchas` és `signo-mudas`. Nem cseréltem és nem használtam fel semmit.

## 14. Hiányzó képek (`IMAGE-MISSING-LIST.md`)
**112 tervezett saját fotó** (P0: 9 · P1: 48 · P2: 38 · P3: 17) + **16 infografika**. Kategóriák: személyes márka 10, szárazgőz 10, vegyszer 8, felderítés/IPM 19, makró 24, B2B 5, helyi 18, okmány 6, egyéb 12.

## 15. Oldalankénti képigény
Minden tervezett URL képbriefje: **`PAGE-IMAGE-MAP.csv`** (225 sor: oldal × szekció × kép-ID, szerep, mobil kivágás, státusz, prioritás, SEO-fájlnév, ES/EN alt és képaláírás) + `IMAGE-ASSET-INVENTORY.csv` (cél, ábrázolt tartalom, tájolás, arány, felbontás, jogok, adatvédelem). Újrahasznosított képek szerepelnek, nincs mesterséges duplikáció.

## 16. ⭐ Fotózási feladatlista — **ezt készítsd/gyűjtsd össze ELŐSZÖR** (`PHOTO-SHOT-LIST.md`)
A fotózás a leghosszabb átfutású tétel és **nem függ a fejlesztéstől — már most indítható.** P0 (9 kép):
1. **IMG-ABOUT-01** — fekvő portré munkaruhában, természetes fényben, ≥ 2400 px.
2. **IMG-ABOUT-02** — álló portré, mellkasig, semleges háttér.
3. **IMG-ABOUT-05** — a gőzgép teljes képe (a *tényleges* gép; típusfelirat olvasható).
4. **IMG-CRED-01** — az egészségügyi kártevőirtó bizonyítvány szkennelve (300 dpi), kitakarás nélkül (a kitakarást mi végezzük irreverzibilisen).
5. **IMG-DRY-01** — teljes gépfotó működésre kész állapotban, kezelőfej + tömlő látszik.
6. **IMG-DRY-03** — a kezelőfej közeli fotója gőzzel.
7. **IMG-DRY-04** — *fekvő, legalább 2400 px széles saját fotó, amelyen a gép kezelőfejével egy matracvarrás tényleges kezelése látható.*
8. **IMG-INS-01** — matracvarrás ellenőrzése lámpával (valós munkán vagy saját matracon `DEMO_`).
9. **IMG-IPM-01** — te dolgozol egy hálószobában (felderítés/kezelés), hero a módszertan-oldalra.
Közben: gyűjtsd össze a **meglévő saját fotóidat** (makró, munka, bizonyítvány) és add meg a képek eredetét (OWNER-INPUT #25–#27). Általános szabály: telefon is jó, eredeti fájl, nincs vaku a makrón, vonalzó a képen, nincs ügyfél-adat/arc, a helyet mindig jegyezd (más városban készült kép nem lehet helyi referencia).

## 17. Szükséges infografikák (`INFOGRAPHICS-PLAN.md`)
16 SVG (ES/EN): IPM-folyamat, életciklus, nimfastádiumok, fajazonosítás, anatómia, méretarány, búvóhelyek, matrac/ágykeret-pontok, behurcolási útvonalak, szállodai folyamat, előtte/utána ellenőrzőlista, monitorozás, technológia-összehasonlítás, IPM vs egyszeri, megelőzés. Biológiai ábrák publikálás előtt szakmai ellenőrzéssel. P1-ben: IG-01, 11, 12, 14, 15.

## 18. Szükséges tanúsítványok és dokumentumok
Egészségügyi kártevőirtó bizonyítvány (P0) · magyar nyilvántartási adat (ha publikálható) · minden továbbképzési tanúsítvány · nemzetközi képzések · a használt biocid-termékek igazolt, spanyolországi engedélyezettsége · működési státusz Spanyolországban (ROESB/cégforma) · gép-gyártói dokumentáció. Mind kitakarva a nyilvános verzióban.

## 19. Tulajdonostól bekérendő információk (`OWNER-INPUT-REQUIRED.md`, 38 tétel)
Blokkolók: **#1** melyik ár érvényes? · **#2** jogi azonosító adatok · **#3** valódi szolgáltatási területek · **#4** preview-hosting és deploy-mód · **#7–#12** IPM-lépések, gép típusa és beállításai, használt termékek, utóellenőrzés, rés-lezárás · **#13, #16** végzettség és működési státusz · **#25, #27** képek eredete és meglévő fotók.

## 20. Technikai fejlesztési terv (`TECHNICAL-SEO-SPEC.md`, `DATA-ARCHITECTURE.md`)
Statikus HTML + kis Node build-szkript (nincs keretrendszer, nincs WordPress), `data/` mint egyetlen forrás (ár, telefon, WhatsApp, szolgáltatás, terület), státuszkapus sitemap/robots/noindex, képpipeline (AVIF/WebP, EXIF/GPS törlés), JSON-LD `@id`-entitásháló, validátorok, **a védett oldalak passthrough**, konzisztencia-ellenőrző (csak olvas) — ez már most kimutatná az A-C1-et. Automatizált SEO-minőségellenőrzés: `SEO-QUALITY-GATE.md`, `SEO-MONITORING.md`, `TEST-PLAN.md`. Ads-védelem: `ADS-PROTECTION.md` (védett lista, regressziós teszt, baseline-hash).

## 21. Jogi és publikálási korlátok (`LEGAL-PUBLICATION-GATES.md`)
10 kapu (LGL-01…10). **LGL-01 (spanyolországi működés feltételei) blokkolja a tranzakciós oldalak élesítését**; a tudásközpont, IPM-tartalom, sablonok, képek előkészíthetők `Draft/noindex` státuszban. A P0 keresés a ROESB/biocid-szabályozás általános keretét igazolta (Valenciai Közösség: Decreto 96/2004, Orden 1/2013, 1/2018 — hatály ellenőrizendő); a **valenciai alkalmazói képzettségi követelmény és a magyar képesítés elismerése nem lett igazolva** → spanyol szakértő bevonása javasolt a P1 előtt.

## 22. Kockázatok
| # | Kockázat | Mérséklés |
|---|---|---|
| R1 | Ads-konverzió sérül | védett lista, külön ág/preview, hash+DOM-regresszió, nincs deploy |
| R2 | Működési/jogi megfelelés hiánya | LGL-kapuk, szakértő, `Draft` státusz |
| R3 | Ár-ellentmondás (A-C1) fogyasztói és Ads-kockázat | #1 döntés, központi adat, csak jóváhagyott javítás |
| R4 | Kép-jog/AI-eredet bizonytalan | provenance-nyilatkozat, új oldalakon csak igazolt kép |
| R5 | A saját fotók hiánya lassítja a projektet | fotózás azonnali indítása |
| R6 | Vékony/duplikált tartalom, kannibalizáció | szándék-térkép, 25 cikk (nem száz), build-ellenőrzés |
| R7 | Szakmai/biológiai tévedés | ellenőrzött források, szakmai ellenőr, kézi jóváhagyás |
| R8 | Nincs mérés (üres ID-k) → vakon optimalizálunk | #5 hozzáférések, mérési terv |
| R9 | Egy fő kapacitása | fázisolt, egyszerre egy fázis, minimális automatizmus |
| R10 | Volumenadat nélküli tervezés | Keyword Planner + GSC, felülvizsgálat a P1 végén |

## 23. Jóváhagyást igénylő döntések (`DECISION-LOG.md`)
1. A P0 terv és az **architektúra-eltérések** (§6) elfogadása.
2. Preview-hosting és deploy-mód (D-004, #4); generált HTML a repóban (D-005).
3. Külön `seo.css` és `.sx-` előtag (D-006).
4. Főoldali **lábléc hub-linkek** (D-008) — külön jóváhagyás.
5. **A-C1/A-C2 javítása** (D-010) — előbb az ár-igazság (#1).
6. Terminológia: „tratamiento combinado vapor + químico” (D-014).
7. Mobil sticky-CTA az új tranzakciós oldalakon (#32).
8. Spanyol jogi szakértő bevonása a P1 előtt (#37).
9. Opcionális, alacsony kockázatú: `/precios` → `/precios.html` 301, HSTS, betűtípus-önhosztolás (külön csomagban).

## 24. P1 pontos feladatai (`IMPLEMENTATION-ROADMAP.md` §P1)
P1-01 tulajdonosi döntések rögzítése · P1-02 preview + noindex · P1-03 repo-szerkezet és deploy-kizárás · P1-04 adatréteg · P1-05 build-szkript + státuszkapu · P1-06 `seo.css` + komponensek · P1-07 9 sablon, nem publikus fixtúrával · P1-08 head/hreflang-generátor · P1-09 sitemap-generátor · P1-10 JSON-LD · P1-11 képpipeline · P1-12 validátorok · **P1-13 Ads-regressziós teszt** · P1-14 Lighthouse/axe baseline · P1-15 régi sablonok egységesítése (javaslat) · P1-16 A-C1/A-C2 javítási csomag (külön ágon, jóváhagyással).

## 25. P1 elfogadási kritériumai
- Build és minden validátor fut; szándékosan hibás fixtúrán **piros**, jón **zöld**.
- **Védett fájlok bájtra változatlanok** (`git diff --quiet 3c4f9f6`), Ads-regresszió zöld.
- Preview él, **noindex + `X-Robots-Tag`** (curl-lel igazolva); éles érintetlen.
- Mind a 9 sablon hibátlan 360/768/1280 px-en, vizuálisan jóváhagyva.
- Kölcsönös hreflang, státuszkapus sitemap, érvényes JSON-LD a fixtúrákon.
- Lighthouse/axe baseline dokumentálva a 6 meglévő oldalon.
- **Semmi sincs élesítve, semmi sincs indexelhető Draft státuszban.**

---

### Következő lépés
Kérlek, nézd át a §23 döntéseit és a §19 blokkoló kérdéseit, és **indítsd el a fotózást** (§16). Jóváhagyás után indul a P1.
