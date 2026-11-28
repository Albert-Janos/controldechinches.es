# CHANGELOG — SEO-projekt

Formátum (minden érdemi változásnál): **dátum · változás · ok · kiindulási állapot · várt eredmény · tényleges eredmény (28/90 nap) · további teendő**. A weboldal élő fájljainak változásait itt és a git-történetben is követjük.

## 2026-11-27 — P0 (audit, kutatás, tervezés)
- **Változás:** `docs/seo/` dokumentációs készlet létrehozva (strukturált, nem publikus). **A weboldal fájljai, képei, CSS-e, JS-e, trackingje, diszpécsere és az éles deploy érintetlen.**
- **Ok:** P0 fázis a mesterterv szerint.
- **Kiindulási állapot:** `3c4f9f6`; 6 indexelhető URL; üres mérési konfig; A-C1/A-C2/A-C3 kritikus megállapítások (CURRENT-STATE-AUDIT).
- **Várt eredmény:** tulajdonosi jóváhagyás után a P1 indítható.
- **Tényleges eredmény:** –
- **Tennivaló:** P0 jóváhagyási pont (P0-CLOSING-REPORT).

## 2026-11-27 — P0 jóváhagyás után: P0.1 + P1 (helyi `develop/seo` ág, nincs deploy)
- **Árak egységesítése (`5c10490`)** · ok: A-C1/A-C2, tulajdonosi árlogika · kiindulás: Esencial/Completo + ES/EN eltérés + konzolhiba · várt: egységes árak, hibamentes kalkulátor · eredmény: `tools/check-prices.mjs` és `tools/test-calculator.mjs` zöld · teendő: kiegészítők jóváhagyása (D-018), deploy tulajdonosi jóváhagyással.
- **a11y/og:image (`c2c9e3d`)** · ok: axe, linkellenőrzés · eredmény: 0 axe-hiba, 0 törött belső hivatkozás.
- **P1 infrastruktúra (`94c3e0f`, `095cc03`)** · generátor, 9 sablon, design system, csomagoló, képpipeline, minőségkapu, Ads-regresszió · eredmény: `tools/test-all.mjs` · teendő: tartalom (blokkolók: OWNER-INPUT).
- **Éles baseline mérés** · Lighthouse 13.6.0 mobil+desktop, axe 4.14.1, link-ellenőrzés: CURRENT-STATE-AUDIT „Frissítés — P0.1”.

## 2026-11-27 (folytatás) — főoldali LCP, P2–P7 piszkozatok, helyi előnézet
- **Főoldali hero `<picture>`** + AVIF (`perf(home)` commit) · ok: tulajdonosi engedély a mobil-LCP javítására · kiindulás: CSS-háttér + 2 preload, LCP 6,0 s (éles Lighthouse, szimulált) · eredmény: lásd PERFORMANCE-STANDARDS „Főoldali mobil-LCP optimalizálás” (valós throttlingon LCP változatlan, nyereség: bájtok, felderíthetőség; éles igazolás deploy után) · tennivaló: éles mérés; font-önhosztolás külön döntés.
- **80 generált oldalfájl (40 oldaldefiníció, ES+EN) piszkozatként** (hub, IPM, szolgáltatások, Sobre mí, GYIK, zónák, atlasz, azonosító, dokumentumok, 20 forrásalapú cikk) · helyi előnézet + fejlesztői index · mind Draft/noindex, `dist/`-be nem kerül.
- **Beágyazott SVG-infografikák** (IG-01, 02, 10–13, 15), nyomtatható űrlap-sablon (`docform`), `OWNER-INPUT-REQUIRED.md` egyesítve (12 téma, prioritással).

## 2026-11-27 — munkamenet lezárása
- A fejlesztési szakasz elfogadva; a szakmai tartalmakat a tulajdonos ChatGPT-vel nézi át (külső ellenőrnek nem küldjük). Átadási útmutató: SEO-MASTER-PLAN.md 7. fejezet. Minden piszkozat Draft/noindex; nincs merge, deploy, FTP-feltöltés.

## 2026-11-27 — 1. javítási csomag (audit alapján; `develop/seo`, nincs merge, deploy, FTP)
- **P0 részleges publikálás:** a generátor (`templates/components.mjs`, `templates/templates.mjs`, `tools/build.mjs`) élesben nem hagy linket nem publikált oldalra: kártyák link nélkül, hub-bejegyzések / „Temas relacionados” / morzsák elrejtve, törzsszöveges linkek sima szöveggé alakulnak; a production build dead-link kapuval védett. Előnézetben minden link megmarad. Teszt: `tests/test-partial-publish.mjs` (124 szimulált részleges állapot, valódi publikálás nélkül).
- **P1 képméretezés:** kép-típus osztályok (hero / photo / macro / portrait / illustration), álló portré szöveg mellett, galéria kivágás nélkül; a hero és a törzsbeli kép nem ismétlődik (PG-012, 014, 041, 047). Lásd VISUAL-DESIGN-SYSTEM „Képméretezés”.
- **P1 SVG:** egyedi marker-azonosítók, szélesség-alapú tördelés, a tartalomhoz igazodó kártyamagasság (nincs túlcsordulás); PG-011 dupla számozás megszűnt.
- **P1 árak/meta:** PG-014 meta description javítva (alkalmankénti, hálószám-függő ár), PG-014 teljes kompakt árlista, PG-013 önálló gőzár az elsődleges — mind `data/prices.json`-ból.
- **P1 WhatsApp:** a generált oldalak WhatsApp-linkjei előtöltött üzenet nélkül (`data/whatsapp.json` megszűnt); a védett oldalak érintetlenek.
- **P1 PG-071:** üres beküldésre kitöltési figyelmeztetés, nem eredmény; a negatív eredmény nem zárja ki a fertőzöttséget. Teszt: `tests/test-identifier.mjs`.
- **P1 szakmai pontosítás (PG-012/013/014)** kizárólag tulajdonosi adat nélkül igazolható állításokkal; a nyitott tételek (géptípus, biocidok, reentry-idők) OWNER-INPUT státuszban maradnak.
- **Eszközök:** `tools/check-prices.mjs` már csak olvas (nem írja át `js/prices.js`-t); új `tools/audit-layout.mjs` (képméret, SVG-túlcsordulás, duplikált id); `tools/validate.mjs`: duplikált id, ismétlődő kép, előtöltött WhatsApp-szöveg, hálószobánkénti ár a meta description-ben.

## 2026-11-27 — 2. munkacsomag: szakmai tartalom és tulajdonosi adatok (`develop/seo`, nincs merge/deploy/FTP; minden oldal Draft + noindex)
- **Központi adatok:** `data/prices.json` (nettó + `vat` + `extras` + `terms`), `data/site.json` (dispatcher/WhatsApp külön, 18 település, személy), új `templates/prices.mjs` (fogyasztói ár és tokenek), `towns` blokk, IVA-kapu a production buildben.
- **Tartalom (ES+EN):** PG-011, 012, 013, 014 (érdemi bővítés), 015, 016, 017, 020, 021–023 (egyedi keresési szándék), 030 (GYIK ellentmondások), 049, 053–056, 060, 061, 072 célzott frissítése.
- **Gyártói adatok:** Polti Cimex Eradicator, HPMed — MANUFACTURER-DATA.md.
- **Dokumentáció:** OWNER-APPROVALS-WP2.md (új, verziózott), OWNER-INPUT státusz, DECISION-LOG D-029–D-038, PHOTO-SHOT-LIST „H”.
- **Tesztek:** új `tests/test-content-consistency.mjs` (telefonszámok, terület, árak, ES/EN-szerkezet, Draft/noindex).

## 2026-11-27 — képcsomag: feldolgozás és beillesztés (`develop/seo`, nincs merge/deploy/FTP; Draft + noindex változatlan)
- 28 feltöltött kép auditja, 27 feldolgozva (WebP+AVIF, spanyol SEO-fájlnevek, ES/EN alt, kitakarás/vágás, metaadat törölve), beillesztve a megfelelő oldalakra/szekciókba (szolgáltatások, felderítés, IPM, ingatlantípusok, városi oldalak, bemutatkozás, PG-073, tudásközpont).
- Képeredet jelölés (`provenance`), illusztrációk külön felirattal; opcionális képek production-ben kihagyva; `MISSING-IMAGES.md` (hiánylista); új eszközök: `audit-raw-images`, `fill-image-assignments`, `image-report`, `list-missing-images`, `build-missing-images-doc`, `shot-element`.
- `tools/audit-layout.mjs`: lusta képek betöltése, törött kép, CLS/LCP és képbájt mérés.

## 2026-11-27 — képek 2. kör: forrásnyilatkozat, helyőrzők megszüntetése, videó (`develop/seo`, nincs merge/deploy/FTP; Draft + noindex változatlan)
- Képforrások lezárva (Unsplash / AI / saját); `provenance`: own / ai / unsplash; az Altea-kép kivéve (felismerhető személyek).
- **Nincs üres képhely sehol** (előnézetben sem); hiányzó kép nem blokkol; tartalomjegyzék és atlasz-szűrők a megjelenő tartalomhoz igazítva; PG-016: okmányok kihagyva (csak Lantra).
- Fertőzöttségi fotók újra elosztva (PG-041, 044, 053, 059, 070, 073); PG-070 atlasz szöveges kiegészítéssel, hiányzó elemek nélkül.
- **Videó** a szárazgőzös oldalon (ES/EN): WebM 72 KB, hang/metaadat nélkül, kattintásra indul, poster WebP/AVIF; új: `tools/process-video.mjs`, `tools/video-frames.mjs`, `tests/test-video.mjs`, `data/videos.json`; `tools/serve.mjs`: video MIME + Range.
- `MISSING-IMAGES.md` újraírva: 3 kért új kép (mind ajánlott); OWNER-INPUT 14. szakasz lezárva.

## 2026-11-27 — fotóatlasz (PG-070) teljes tervének visszaállítása (`develop/seo`, nincs merge/deploy/FTP; Draft + noindex változatlan)
- Visszaállítva: mind a 8 kategória és szűrőgomb (huevos, ninfas is), kategória-szövegek forrásokkal, fajazonosítás + hasonló rovarok szakasz, forráslista; a lead/meta description újra a teljes atlasz tartalmát írja le.
- Új képhelyek: `IMG-ENT-EGG-03`, `IMG-SEV-01`, `IMG-SEV-02` (inventory + page-image map); a renderer az üres, de szöveges csoportot megjeleníti, a hiányzó képet nem.
- `docs/seo/ATLAS-IMAGE-LIST.md` (generált, soronként minden atlasz-kép), `tools/build-atlas-image-list.mjs`, atlasz-teszt a konzisztencia-tesztben.

## 2026-11-28 — élesítés-előkészítés és 4. munkacsomag (képek) (`develop/seo`; nincs merge, deploy, FTP)
- **Publikálás:** 24 oldalpár (PG-017, 040, 041–062 cikkek, 070, 071) `Approved for indexing`, `dates` kitöltve, belső „Pendiente del propietario” blokkok eltávolítva (a PG-070 jegyzete publikus szöveggé írva). 16 oldal marad Draft/noindex (D-051). Production build: 48 generált + 6 meglévő = 54 indexelhető URL, sitemap 54.
- **Validátor:** szakmai lektor nélküli cikk = figyelmeztetés (D-050). `tests/test-content-consistency.mjs`: production-indexelési ellenőrzés (index,follow; nincs noindex/draft/owner-jegyzet; canonical; nincs localhost).
- **Védett oldalak:** lábléc „Guía/Guide” link (D-053), `politica-privacidad.html` WhatsApp-ikon SVG-hiba javítva (konzolhiba). Ads-védelmi baseline újrarögzítve.
- **Képek:** 17 új saját fotó + 14 makró + munkaruhás önarckép feldolgozva (`tools/fill-image-assignments.mjs`, `process-images.mjs`); atlasz 27/29 kitöltve; új: IMG-INS-07, IMG-CHEM-09, IMG-CHEM-10; PG-045 és PG-049 fejképe saját fotóra cserélve; IMG-DRY-04 (P0) és IMG-PREP-01 kitöltve; PG-070 szövegei az illusztrációkról (D-054).
- **Eszközök:** `tools/audit-dist-render.mjs` (minden oldal mobil+asztali renderelés, törött kép, srcset/sizes, CLS, konzol), `tools/build-publication-missing-data.mjs` → `PUBLICATION-MISSING-DATA.md`.
