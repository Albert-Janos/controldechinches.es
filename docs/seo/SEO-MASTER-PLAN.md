# SEO-MASTER-PLAN — Control de Chinches (összefoglaló és dokumentumtérkép)

Ez a dokumentum az **index és a közös szabályok forrása**. A többi dokumentum ide hivatkozik; a szabályokat nem ismétli.

## 1. Cél
A `controldechinches.es` hosszú távon legyen az ágyi poloskával foglalkozó, szakmailag hiteles, kétnyelvű (ES/EN) szolgáltatói és tudásportál a Costa Blancán — úgy, hogy a **jelenlegi Google Ads landingek konverziója érintetlen marad**. Mérhető célok (nem garantált eredmények): organikus megjelenés/kattintás, nem márkás lokális láthatóság, WhatsApp- és telefonos megkeresések, B2B érdeklődés. Nem ígérünk helyezést, AI-megjelenést vagy üzleti eredményt.

## 2. Döntési sorrend (kötelező)
1 szakmai pontosság › 2 jogi megfelelés › 3 valódi ügyfélérték › 4 Ads-konverzió védelme › 5 hitelesség › 6 technikai stabilitás › 7 organikus láthatóság › 8 vizuális minőség › 9 teljesítmény › 10 karbantarthatóság › 11 költséghatékonyság.

## 3. Közös szabályok (egy helyen)
- **Védett területek és tiltások:** ADS-PROTECTION.md
- **Publikálási kapuk és státuszok:** LEGAL-PUBLICATION-GATES.md, SEO-QUALITY-GATE.md
- **Tartalmi/szakmai szabályok, források:** CONTENT-STANDARDS.md, EDITORIAL-POLICY.md
- **Képszabályok (eredetiség, AI-tilalom):** IMAGE-STRATEGY.md
- **Technikai specifikáció:** TECHNICAL-SEO-SPEC.md
- **Nem találunk ki adatot:** hiányzó adat → `OWNER-INPUT-REQUIRED.md` / `UNVERIFIED` jelölés.

## 4. Dokumentumtérkép

| Csoport | Dokumentumok |
|---|---|
| Stratégia | SEO-MASTER-PLAN, CURRENT-STATE-AUDIT, COMPETITOR-ANALYSIS, KEYWORD-RESEARCH, KEYWORD-URL-MAP.csv, KEYWORD-PLANNER-IMPORT.csv, SITE-ARCHITECTURE, PAGE-INVENTORY.csv, IMPLEMENTATION-ROADMAP |
| Tartalom | CONTENT-STANDARDS, CONTENT-BRIEFS, IPM-METHODOLOGY, AUTHOR-AND-CREDENTIALS, KNOWLEDGE-CENTER-PLAN, FAQ-STRATEGY, CASE-STUDY-STANDARD, EDITORIAL-POLICY |
| Vizuális | VISUAL-DESIGN-SYSTEM, PAGE-TEMPLATES, DESKTOP-MOBILE-WIREFRAMES, IMAGE-STRATEGY, IMAGE-ASSET-INVENTORY.csv, IMAGE-REQUIREMENTS, PAGE-IMAGE-MAP.csv, IMAGE-MISSING-LIST, PHOTO-SHOT-LIST, INFOGRAPHICS-PLAN, IMAGE-SEO-SPEC |
| Technikai | TECHNICAL-SEO-SPEC, MULTILINGUAL-SEO, INTERNAL-LINKING, STRUCTURED-DATA, PERFORMANCE-STANDARDS, ACCESSIBILITY-STANDARDS, DATA-ARCHITECTURE, ADS-PROTECTION |
| Mérés / QA | SEO-QUALITY-GATE, SEO-MONITORING, CONVERSION-MEASUREMENT, OFF-PAGE-STRATEGY, LEGAL-PUBLICATION-GATES, TEST-PLAN, OWNER-INPUT-REQUIRED, DECISION-LOG, CHANGELOG |
| Lezárás | **P0-CLOSING-REPORT.md** (magyar, tulajdonosi jóváhagyásra) |

## 5. Munkafolyamat
Adatgyűjtés → elemzés → javaslat → tulajdonosi jóváhagyás → Preview → teszt → (tulajdonos által végzett) élesítés → eredménymérés. Az automatizmus **soha nem módosít éles tartalmat**.

## 6. Fázisok
P0 audit/terv (kész) → P1 infrastruktúra → P2 személyes márka → P3 IPM+szolgáltatások → P4 lokális → P5 GYIK+tudásközpont → P6 atlasz/eszköz/dokumentumok → P7 B2B+esettanulmány → P8 folyamatos. Részletek: IMPLEMENTATION-ROADMAP. **Egyszerre egy fázis, mindegyik jóváhagyás után.**


---
# 7. MUNKAMENET-ÁTADÁS (állapot 2026-11-27 — ezt olvasd el először egy új Claude-munkamenetben)

## 7.1 Hol tartunk
- **Ág:** `develop/seo` (GitHub: `Albert-Janos/controldechinches.es`). **Utolsó kódkommit: `461eb37`**; az átadási szakaszt tartalmazó, ezt követő dokumentációs kommit az ág **HEAD-je** (`git rev-parse --short origin/develop/seo`). `main` változatlan: `3c4f9f6` (baseline). **Nincs merge, deploy, FTP-feltöltés.** A munkamappa egy git worktree (az ág neve eltérhet) — push: `git push origin HEAD:develop/seo`.
- Kész: P0 (audit/tervek, 46 dok.), P0.1 (árak egységesítve, kalkulátor-hiba javítva), P1 (generátor, 9 sablon, csomagoló, képpipeline, minőségkapu, Ads-regresszió), főoldali LCP-javítás, P2–P7 **piszkozatok** (40 oldaldefiníció, 80 ES/EN fájl, mind **Draft/noindex**, az éles `dist/` csomagba nem kerülhet).
- **Nincs kész / blokkolt:** a tartalmak éles publikálása (szakmai ellenőrzés, jogi kapuk, tulajdonosi adatok, fotók), P4 2. hullám, P8 (GSC/GA4), a mérési azonosítók (a `measurement-config.js` üres), a kiegészítő árak végleges jóváhagyása, a főoldali lábléc-linkek, betű-önhosztolás a védett oldalakon.

## 7.2 Első lépések új munkamenetben
```powershell
git checkout develop/seo ; git pull            # a fő projektmappában (ha worktree-ben dolgozol: git fetch, majd az ágra állj)
cd tools ; npm install                          # egyszeri; sharp, lighthouse, puppeteer-core, axe-core, betűtípus (csak helyi eszköz)
cd .. ; node tools/test-all.mjs                 # teljes tesztkészlet (~10-12 perc; Chrome/Edge kell)
```
Szabályok (változatlanok): ne módosítsd a `main`-t; ne deployolj; ne tölts fel FTP-re; az éles publikálás tulajdonosi jóváhagyás után, kézzel, **kizárólag a `dist/` mappából** (`node tools/package-site.mjs --mode production --out dist`); a védett Ads-oldalakat (`ADS-PROTECTION.md`) csak kifejezett jóváhagyással módosítsd, utána `node tests/test-ads-protection.mjs --update`; semmit ne találj ki (képesítés, tapasztalat, eset, helyi referencia, ár, mérési ID); a Draft oldalak maradjanak noindex.

## 7.3 Helyi előnézet
- **Indítás (a repó gyökeréből):** `node tools/preview.mjs` (alapértelmezett port: 4173; más port: `node tools/preview.mjs 4180`; tesztoldalakkal: `--fixtures`). Ez felépíti a `dist-preview/` mappát (minden Draft, noindex, DRAFT-sáv) és kiszolgálja.
- **Fejlesztői oldalindex:** **http://127.0.0.1:4173/__dev/index.html** (minden oldal, nyelvi változatok, státusz, blokkolók, képhely- és TODO-darabszám, linkgráf: `/__dev/links.json`). Csak előnézetben létezik; production csomagba kerülése tiltott (a csomagoló megtagadja).
- Gyorsparancsok: `node tools/package-site.mjs --mode preview --out dist-preview` (csak építés) · `node tools/validate.mjs --dir dist-preview --mode preview` (minőségkapu) · `node tools/serve.mjs 4174 dist-preview` (csak kiszolgálás).

## 7.4 A 20 cikk forrásfájljai (ES+EN egy-egy JSON-ban; szerkeszd a JSON-t, ne a generált HTML-t)
Mappa: `data/pages/`. Struktúra: `es`/`en` → `title`, `description`, `h1`, `answer`, `blocks[]`, `faq[]`, **`sources[]`** (cím, kiadó, év, URL, ellenőrzés dátuma), `related[]`. Státusz: `status: "Draft"`.
| Fájl | ES URL | Téma |
|---|---|---|
| `data/pages/PG-041.json` | /guia-chinches/como-saber-si-tengo-chinches/ | jelek |
| `data/pages/PG-042.json` | /guia-chinches/picaduras-de-chinches/ | csípések |
| `data/pages/PG-043.json` | /guia-chinches/ciclo-de-vida-chinche-de-cama/ | életciklus |
| `data/pages/PG-044.json` | /guia-chinches/donde-se-esconden-las-chinches/ | búvóhelyek |
| `data/pages/PG-045.json` | /guia-chinches/chinches-en-el-colchon/ | matrac |
| `data/pages/PG-047.json` | /guia-chinches/como-se-contagian-las-chinches/ | terjedés |
| `data/pages/PG-048.json` | /guia-chinches/chinches-viajes-y-hoteles/ | utazás |
| `data/pages/PG-049.json` | /guia-chinches/como-eliminar-chinches-de-cama/ | módszerek áttekintése |
| `data/pages/PG-050.json` | /guia-chinches/vapor-contra-chinches/ | gőz |
| `data/pages/PG-051.json` | /guia-chinches/remedios-caseros-chinches-mitos/ | házi praktikák |
| `data/pages/PG-052.json` | /guia-chinches/resistencia-insecticidas-chinches/ | rezisztencia |
| `data/pages/PG-053.json` | /guia-chinches/por-que-vuelven-las-chinches/ | visszatérés |
| `data/pages/PG-054.json` | /guia-chinches/cuantos-tratamientos-chinches/ | hány kezelés |
| `data/pages/PG-055.json` | /guia-chinches/preparar-vivienda-tratamiento-chinches/ | előkészítés |
| `data/pages/PG-056.json` | /guia-chinches/despues-del-tratamiento-chinches/ | utána |
| `data/pages/PG-058.json` | /guia-chinches/ropa-y-textiles-chinches/ | ruha/textil |
| `data/pages/PG-059.json` | /guia-chinches/sellar-grietas-chinches/ | rések lezárása |
| `data/pages/PG-060.json` | /guia-chinches/monitorizacion-chinches/ | monitorozás |
| `data/pages/PG-061.json` | /guia-chinches/protocolo-hotel-chinches/ | szállodai protokoll (La Rioja) |
| `data/pages/PG-062.json` | /guia-chinches/deteccion-temprana-apartamentos/ | korai felismerés |
EN URL-ek: `/en/bed-bug-guide/<slug>/` (a slugokat lásd `docs/seo/PAGE-INVENTORY.csv`, `url_en`). A cikkeket generáló egyszeri szkript nincs a repóban — **a JSON a forrás**. Nem cikk, de szintén szakmai ellenőrzést igényel: `PG-011` (IPM), `PG-013` (vapor seco), `PG-014` (tratamiento químico), `PG-012`, `PG-015`, `PG-071` (azonosító logika), `PG-070` (atlasz).
Előnézet cikkenként: `/__dev/index.html` → a sor linkje. A **külső források listája** minden cikk alján látszik; a kutatási jegyzetek (források, eltérések, hiányok): `KNOWLEDGE-CENTER-PLAN.md` „Állapot — 2026-11-27” és `LEGAL-PUBLICATION-GATES.md` „Kutatási megállapítások”.

## 7.5 Szakmai ellenőrzés sorrendje (a ChatGPT-s átnézéshez; kockázat és hatás szerint)
1. **Kezelés és biztonság** (a legkockázatosabb állítások): PG-049, PG-050 (gőz — a saját technológiád!), PG-051, PG-052 (rezisztencia, spanyol adatok), PG-053, PG-054.
2. **Előkészítés / utókezelés / textil** (számok eltérnek a források között, biztonsági vonatkozás): PG-055, PG-056, PG-058.
3. **Felismerés / biológia** (azonosítás, egészségügyi mondatok): PG-041, PG-042, PG-043, PG-044, PG-045.
4. **Terjedés és megelőzés:** PG-047, PG-048, PG-059, PG-060.
5. **Szálláshely (B2B):** PG-061, PG-062 (jogi hangsúly: nincs jogi tanács; a La Rioja-útmutató összefoglalása).
6. Végül a nem-cikk oldalak (PG-011, 013, 014, 012, 015, 071, 070) — ezekhez a tulajdonosi válaszok (#7–#12) is kellenek.
**Mit kérj az ellenőrzéstől cikkenként:** (a) minden állítás megfelel-e a hivatkozott forrásnak; (b) a forrás tényleg létezik és elérhető-e (az EPA-oldalak dátuma a letöltő eszköz kivonata, a tudományos cikkeknél csak az absztrakt volt olvasva); (c) számok és mértékegységek (°C/°F, percek, napok); (d) túlzó/garantáló megfogalmazás nincs-e; (e) spanyol és angol szöveg természetessége. A kifogásokat a `data/pages/PG-0xx.json`-ban kell javítani, majd `node tools/validate.mjs --dir dist-preview --mode preview` (előbb `package-site --mode preview`). A státusz **csak a tulajdonos döntésére** léphet előre (LEGAL-PUBLICATION-GATES státuszlánc); addig mindenhol `"status": "Draft"`.

## 7.6 Hiányzó képek — prioritási lista (teljes: `IMAGE-MISSING-LIST.md`, `PHOTO-SHOT-LIST.md`, `IMAGE-ASSET-INVENTORY.csv`, `PAGE-IMAGE-MAP.csv`)
- **P0 (9 fotó, ezekkel indulj):** `IMG-ABOUT-01` (fekvő portré), `IMG-ABOUT-02` (álló portré), `IMG-ABOUT-05` (gőzgép teljes), `IMG-CRED-01` (bizonyítvány szkennelve, kitakarás nélkül), `IMG-DRY-01` (gép működésre kész), `IMG-DRY-03` (kezelőfej közeli), `IMG-DRY-04` (matracvarrás gőzkezelése, fekvő ≥ 2400 px), `IMG-INS-01` (matracvarrás ellenőrzése lámpával), `IMG-IPM-01` (munka közben, hero).
- **P1 (48 fotó):** szárazgőz (`DRY-02, 05–10`), vegyszeres (`CHEM-01…06`), felderítés (`INS-02…06`), IPM (`IPM-02…06`, `IPM-SEAL-01/02`), **makrók** (`ENT-ADU-01/02/03`, `EGG-01`, `NYM-01`, `MOU-01`, `EXC-01`, `HID-01/02`, `SCALE-01` — vonalzóval/érmével, fajt/stádiumot nem AI határozza meg), helyi városképek (`LOC-ALC-01`, `LOC-BEN-01`, `LOC-TOR-01`) .
- **P2 (38):** további makrók, B2B, megelőzés/előkészítés, további okmányok (`CRED-02…06`). **P3 (17):** 2. hullámú települések, valós helyi munkák (csak ha tényleg ott dolgoztál), dokumentum-borítók.
- **Meglévő képek:** egyikhez sincs dokumentált eredet/jog (OWNER-INPUT #25–#26) — új oldalakon nem használhatók, amíg nincs nyilatkozat.
- **Átadás/feldolgozás:** a fotókat a `raw-images/<mappa>/` alá (12 mappa; Git-ből kizárt), mellé rövid jegyzet (dátum, hely, mit látunk). Feldolgozás: `node tools/process-images.mjs scan` → hozzárendelés a `data/images-assign.csv`-ben (kép-ID, jogok, `approved=yes` csak tulajdonosi jóváhagyás után) → `node tools/process-images.mjs process` → `verify` → `node tools/build-image-manifest.mjs`.

## 7.7 Tulajdonosi kérdéslista
**`docs/seo/OWNER-INPUT-REQUIRED.md`** — egyetlen, prioritás szerint rendezett lista, 12 témában (a # számok állandók). Blokkolók: #25–#27 (képek), #2/#16/#37 (jogi), #7–#12 (gép, termékek, IPM-lépések), #13–#15 (végzettség), #3 (szolgáltatási területek), #20 (szakmai ellenőr), #39 (kiegészítő árak). A jogi/vállalkozási adatok pontos 16 pontos listája: `LEGAL-PUBLICATION-GATES.md` (utolsó két szakasz).

## 7.8 A következő munkamenet konkrét feladatai (sorrendben)
1. **Környezet:** pull, `cd tools && npm install`, `node tools/test-all.mjs` zöld; `node tools/preview.mjs` — ellenőrizd az oldalindexet.
2. **A tulajdonos ChatGPT-s átnézésének visszavezetése:** a kifogások beépítése a `data/pages/PG-0xx.json` fájlokba (forrásokkal), `validate` + `test-templates` (`ONLY=PG-049 node tests/test-templates.mjs` egy oldalra), commit + push. Státuszt **ne** léptess a tulajdonos kifejezett döntése nélkül.
3. **Beérkező fotók:** `scan` → vizuális átnézés (előnézetek: `reports/raw/previews/`) → hozzárendelés (jog/eredet bizonytalanságnál kérdezz) → `process`/`verify` → manifest → képhelyek cseréje automatikusan; a feliratokat (fajt/stádiumot) csak ellenőrzés után töltsd ki.
4. **Tulajdonosi válaszok beépítése:** a `todo` blokkok (`grep -R "\"type\": \"todo\"" data/pages`) feloldása a megadott tények alapján (#7–#24); a `_blocked` mezők frissítése.
5. **Hiányzó cikkek:** 046 (kanapé), 057 (gyerekek/háziállatok), 063–065 (B2B) — csak a 2. lépés tanulságai után, ugyanazzal a forráskutatási módszerrel.
6. **Helyi oldalak 2. hulláma** (Elche, Calpe, Orihuela Costa, Altea) és az oldalak helyspecifikus tartalma — csak a #3 válasza és valós helyi tények után.
7. **Üzemeltetési döntések előkészítése jóváhagyásra** (nem végrehajtása): kiegészítő árak (#39), főoldali lábléc-linkek (#29), betű-önhosztolás a védett oldalakon (TBT-költség, lásd PERFORMANCE-STANDARDS), mobil sticky CTA (#32), mérési azonosítók (#5).
8. **Élesítési csomag-próba (nem feltöltés):** `node tools/package-site.mjs --mode production --out dist` + `validate`; a feltöltést kizárólag a tulajdonos végzi, jóváhagyás után.
9. **P8 előkészítése:** Search Console/GA4 hozzáférés (#5), Keyword Planner import (`KEYWORD-PLANNER-IMPORT.csv` → `KEYWORD-URL-MAP.csv` volumenek).

## 7.9 Tudnivalók a környezetről
Windows, Git Bash + PowerShell; `core.autocrlf=true` (a CRLF-figyelmeztetések normálisak). Git Bash a `/...` útvonal-argumentumokat átírja: Node-parancsoknál `MSYS_NO_PATHCONV=1` kell. Bash-heredoc-ban a `\\` és idézőjelek elveszhetnek — regexes/escape-es kódot fájlba írj. A Lighthouse-mérések zajosak: mindig 3–5 futás mediánja. A `reports/` mappában a baseline-ok (éles Lighthouse, axe, link-ellenőrzés, főoldali előtte/utána) megvannak.
