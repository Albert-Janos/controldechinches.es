# CURRENT-STATE-AUDIT — P0 baseline (2026-11-27)

Státusz: **read-only audit**. A weboldalon, a képeken, a CSS-en, a trackingen és a diszpécseren **nem változtattam semmit**. Minden állítás mellett jelölve van a forrás: `[kód]` = repo fájl, `[élő]` = az éles oldalon (curl / böngészőpanel) ellenőrizve 2026-11-27-én, `[nem igazolt]` = hozzáférés hiányában nem ellenőrizhető.

## 1. Technológia és üzemeltetés

| Terület | Megállapítás | Forrás |
|---|---|---|
| Stack | Kézzel írt statikus HTML (8 oldal), 1 közös CSS (`assets/site.css`, 30 KB), natív ES-modul JS (`js/main.js`, `js/landing.js`, `js/measurement-config.js`). Nincs build, nincs csomagkezelő, nincs CI. | [kód] |
| Hosting | Apache (élő `Server: Apache`), `.htaccess` kommentje szerint WebDigital.hu / cPanel / LiteSpeed. Deploy módja nincs dokumentálva a repóban. | [kód][élő] |
| Preview / staging | **Nincs** a repóban (nincs Netlify/Vercel/GitHub Pages konfig, nincs noindex-mechanizmus). | [kód] |
| Git | 1 commit (`3c4f9f6 Initial website baseline before SEO development`), ág: `claude/control-chinches-seo-master-8bac65`, tiszta. Az élő `index.html` a repóval **bájtra egyezik** (CRLF-et leszámítva). | [kód][élő] |
| Tömörítés | gzip él (index 21 618 → 6 139 byte). | [élő] |
| Biztonsági fejlécek | nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, minimális CSP élnek. **HSTS ki van kommentezve.** | [élő][kód] |
| Cache | HTML `max-age=0, must-revalidate`; kép 1 év immutable; CSS/JS 30 nap + `?v=` verziózás. Rendben. | [kód] |

## 2. URL-leltár és státusz [élő]

| URL | Státusz | Indexelhető | Megjegyzés |
|---|---|---|---|
| `/` | 200 | igen | ES főoldal, Ads landing |
| `/en/` | 200 | igen | EN főoldal |
| `/precios.html` | 200 | igen | ES árak + kalkulátor (**lásd A-C1, A-C2**) |
| `/en/prices.html` | 200 | igen | EN árak |
| `/chinches-apartamentos-turisticos/` | 200 | igen | ES apartman B2B |
| `/en/bed-bugs-holiday-rentals/` | 200 | igen | EN apartman B2B |
| `/aviso-legal.html`, `/politica-privacidad.html` | 200 | noindex,follow | jogi (régi sablon) |
| `/gracias.html` | 200 | noindex,nofollow | sehonnan sem linkelt (árva), régi sablon |
| `/404.html` | 404-ként szolgál | noindex | valódi 404 státusz (helyes) |
| `/index.html`, `/en`, `/chinches-apartamentos-turisticos` | 301 → kanonikus | – | helyes, egyetlen lépés |
| `http://` és non-www | 301 → `https://www.` egy lépésben | – | helyes |
| `/precios` (kiterjesztés nélkül) | 404 | – | nincs átirányítás; a minta (`.html` vs. `/`) vegyes |
| `/send-form.php` | 410 | – | szándékos |
| `/css/style.css` | 200 | – | **régi** CSS, csak a 404/gracias/jogi oldalak használják |

Sitemap: 6 URL, kölcsönös hreflang + x-default, `lastmod` nélkül. robots.txt: mindent engedélyez, a sitemapra mutat, de belső útvonalneveket felsorol (`/logs/`, `/lib/`, `/config.php`, `/regi-oldal-backup/`).

## 3. Technikai SEO a 6 indexelhető oldalon [kód]

- title, description, canonical, hreflang (ES↔EN, x-default=ES), `html lang`, 1 db H1, logikus H2: **rendben, egyediek**.
- Kép-alt: minden `<img>`-en van; width/height megadva; hajtás alatt `loading="lazy"`; LCP-kép előtöltve (főoldal, desktop+mobil külön).
- Strukturált adat: oldalanként 1 JSON-LD (`Service` + beágyazott `Organization`; az árak oldalon csak `WebPage`). Nincs `@id`, `WebSite`, `BreadcrumbList`, `Person`, `LocalBusiness`, `Offer`. Nincs hamis AggregateRating (helyes).
- Belső linkelés: fejléc 5 link, lábléc 4 link + jogi. Nincs tudásanyag, nincs városoldal → az indexelhető felület 6 URL.
- Mobil: `viewport` ok, hamburger `<details>`-szel, skip-link van. **Nem futtattam Lighthouse-t / axe-t** → lásd §6.

## 4. Konverzió- és mérési infrastruktúra [kód][élő]

- `js/measurement-config.js` az **éles oldalon is üres**: `ga4Id:''`, `adsId:''`, `whatsappLabel:''`, `phoneLabel:''`. A `main.js` ezért **semmilyen** Google-címkét nem tölt be és a consent-sáv sem jelenik meg.
- A kód felkészült: Consent Mode v2 alapértelmezett „denied”, `ads_data_redaction`, esemény `whatsapp_click` / `phone_click` a `data-cta` attribútumú `wa.me` és `tel:` linkekre, `data-page` az `<body>`-n. **Ezeket védeni kell** (ADS-PROTECTION).
- Nem tudjuk, hogy a Google Ads konverziót más módon mérik-e (hívásasset, külön címke, importált GA4). `[nem igazolt]`
- CTA-k: WhatsApp (elsődleges) + `tel:+34605259206`; a hívást AI-asszisztens fogadja (az oldal kimondja). Az EN oldal is spanyol nyelvű asszisztenst említ.

## 5. Megállapítások súlyosság szerint

### Kritikus
| ID | Leírás | Bizonyíték | Teendő |
|---|---|---|---|
| **A-C1** | **Ár-ellentmondás.** ES `/precios.html` kártyái: „Tratamiento insecticida desde 139 €” és „Tratamiento con vapor seco desde 150 €”; ugyanazon oldal GYIK-ja, a főoldal és az EN árak oldal: Esencial 139 € / Completo 239 €, a vapor **+80 €/hálószoba** kiegészítő. A táblázat címe „insecticida”, a kalkulátor Esencial/Completo ráta. | `precios.html` r.67–97 vs. r.341; `en/prices.html`; `index.html` r.107 | Tulajdonosi döntés: melyik a valós ajánlat (OWNER-INPUT #1). Ads-oldal → csak jóváhagyással javítható. Hosszú távon egy forrás (DATA-ARCHITECTURE). |
| **A-C2** | **JS-hiba az ES árak oldalon.** `landing.js` 152. sor: `setupRadioKeys(panel.querySelector('[role="radiogroup"]'))` → `null`; az ES HTML-ben nincs `radiogroup`/`radio` (az EN-ben van). Konzol: `Uncaught TypeError: Cannot read properties of null`. A kalkulátor kezdeti `update()` hívása nem fut le (a kattintás-kezelők már regisztráltak) → a WhatsApp-gomb kezdetben üzenet nélküli linkre mutat; hatás kattintásos teszttel igazolandó. | Élő konzol 2026-11-27 | Javítás Ads-védett oldalon → jóváhagyás + regressziós teszt. |
| **A-C3** | **Jogi azonosító adatok hiányoznak.** Az aviso legal „Borrador pendiente… antes de iniciar la actividad”; titulár, NIF/CIF, cím, e-mail, regisztráció: `[PENDIENTE]`; „Actividad prevista”. Közben az oldal élesen árat, „¡Incluso hoy!” foglalást és sürgős kiszállást kommunikál. | `aviso-legal.html` | Jogi felülvizsgálat (LEGAL-PUBLICATION-GATES). Nem jogi tanács — szakértővel ellenőrizendő. |

### Magas
| ID | Leírás | Teendő |
|---|---|---|
| A-H1 | A mérési ID-k üresek (§4). Ha az Ads konverziómérés nem itt él, honnan jön? | Owner: Ads-fiók ellenőrzése; csak olvasás. |
| A-H2 | Nincs preview, staging, CI, dokumentált deploy; egyetlen cPanel-éles. | P1: Preview-környezet (D-004), noindex-védelem, deploy-kizárás (`docs/`, `tools/`). |
| A-H3 | Képek eredete/joga ismeretlen; a hero és a „signo-*”, térkép, `apartamento-mediterraneo` kép vizuálisan stock/generált jellegű; a `permetezes…` és `irtas-gozzel01` valószínűleg saját (magyar fájlnevek, magyar belső tér). | IMAGE-ASSET-INVENTORY: tulajdonosi nyilatkozat minden képre. |
| A-H4 | Az `irtas-gozzel01.webp` egy kis kézi gőzölőt mutat — **nem** Polti Cimex Eradicator; a `permetezes…` kollázs magyarországi lakásban készült. Helyi referenciaként/Polti-ként tilos feliratozni. | IMAGE-STRATEGY szabály. |
| A-H5 | Az „¡Incluso hoy!” sürgősségi CTA és a „reservar” megfogalmazás a jogi státusz tisztázásáig kockázatos. | Csak megfigyelés — nem módosítjuk (ADS-PROTECTION). |

### Közepes
| ID | Leírás |
|---|---|
| A-M1 | Szerény JSON-LD: nincs `@id`-alapú entitásháló, `WebSite`, `Breadcrumb`, `Person` (STRUCTURED-DATA). |
| A-M2 | Külső Google Fonts (DM Sans) kéréssel → adatvédelmi szempont (nincs consent); önhosztolt betű javasolt. |
| A-M3 | HSTS ki van kommentezve (hosting-szintű döntés, SSL mindkét hostra működik). |
| A-M4 | Régi sablon (404, gracias, jogi) eltérő dizájn + Oswald/Open Sans betűk + külön CSS; `og:image` → `/img/hero.webp` **nem létezik**. `/img` és `/assets` duplikált (logó, hero). |
| A-M5 | `favicon.ico` 124 KB (nehéz); a főoldalak `<head>`-jében csak `/assets/favicon.ico`, nincs apple-touch-icon / PNG-hivatkozás. |
| A-M6 | URL-minta vegyes (`precios.html` vs. `/mappa/`); `/precios` 404. **Nem nevezzük át** (védett URL); a terv ehhez igazodik. |
| A-M7 | Szolgáltatási terület három helyen három változat: főoldal 15 település, lábléc 4, JSON-LD 3 + Costa Blanca; a térkép Dénia-t is mutatja. Tulajdonosi megerősítés kell. |
| A-M8 | „profesional” gyakori (kártyák, EN H1: „Professional bed bug treatment”). Tartalmi stílus-megjegyzés, Ads-oldalon nem módosítjuk. |
| A-M9 | EN látogató spanyol nyelvű AI-asszisztenst hív — konverziós akadály; döntés: EN hívás-CTA kezelése. |
| A-M10 | Kód-hulladék: `main.js` régi menü-ID-ket keres (`#mobMenu`), a menüt valójában `menu.js` kezeli. Funkcionális hatás nincs. |
| A-M11 | Árva `gracias.html` (nincs rá link; noindex — rendben, de nem használt). |
| A-M12 | Sitemap `lastmod` és képsitemap hiányzik; robots.txt belső útvonalakat sorol fel (alacsony). |

### Lehetőségek
Teljes tudásközpont, szolgáltatás- és városoldalak, szerzői hitelesség (Person), saját fotóatlasz, azonosító eszköz, B2B-dokumentáció, EN lokalizáció, Organization/Person entitásháló, build-time validáció, képsitemap. Ütemezés: IMPLEMENTATION-ROADMAP.

## 6. Nem igazolt (hozzáférés / mérés hiányában)

- Search Console, GA4, Google Ads fiók, CrUX/valós CWV (75. percentilis), indexelt oldalszám, lekérdezések, CTR, pozíciók.
- **Lighthouse és axe-pontszámok** — nem futtattam; PERFORMANCE-STANDARDS tartalmazza a parancsokat és a célokat. Egyetlen böngészős mérés (ES árak oldal, nem szabványos labor): DOMContentLoaded 568 ms, load 930 ms, 8 erőforrás — **tájékoztató, nem Lighthouse**.
- Google Cégprofil, Maps-jelenlét, backlinkprofil, külső említések.
- AI-diszpécser üzleti adatai (ár, terület, nyelv) — a repóban nincs forrás; az élő rendszert nem érintettem.
- ROESB / spanyolországi működési jogosultság (OWNER-INPUT, LEGAL-PUBLICATION-GATES).
- Valós mobil-megjelenés eszközökön, billentyűzet/képernyőolvasó teszt.
- Az üzleti adatok (ár, telefon, WhatsApp-szöveg) forrása a HTML maga: telefonszám ~46 előfordulás 7 fájlban, 8 különböző WhatsApp-üzenet, árak 5 fájlban + `landing.js` ráták → egyetlen forrás hiánya (DATA-ARCHITECTURE).


---
## Frissítés — P0.1 (2026-11-27): javítások és mért baseline

**Javítva a helyi `develop/seo` ágon (nincs deploy):**
| ID | Állapot |
|---|---|
| A-C1 ár-ellentmondás | **Javítva**: ES/EN főoldal, árak oldalak, kalkulátor, WhatsApp-szöveg, GYIK, meta, JSON-LD egységes (D-017); Esencial/Completo kivezetve. |
| A-C2 kalkulátor JS-hiba | **Javítva** (`landing.js`: null-védelem + az árak a központi `js/prices.js`-ből); a böngészőkonzol ES/EN árak oldalon tiszta; `tools/test-calculator.mjs` zöld (1–10 hálószoba, kiegészítők, WhatsApp-üzenet, telefon-CTA, mobil+desktop). |
| A-M4 (részben) | A jogi oldalak törött `og:image`-e javítva. |
| *új* axe-hiba | `label-content-name-mismatch` (nyelvváltó `aria-label`) javítva a 6 oldalon. |
| A-C3, A-H1, A-H3 | **Nyitva** (jogi adatok, mérési ID-k, képjogok) — tulajdonosi bemenet. |

**Mért baseline (éles oldal, javítás előtti állapot, Lighthouse 13.6.0, egyszeri futás oldalanként/módonként, labor, Windows/Chrome — tájékoztató; részletes: `reports/live-baseline-lighthouse.json`):**
| Oldal | Mobil Perf / LCP | Desktop Perf / LCP | A11y | BP | SEO |
|---|---|---|---|---|---|
| `/` | 77 / 6.0 s | 91 / 1.2 s | 100 | 100 | 100 |
| `/en/` | 89 / 3.7 s | 80 / 0.8 s | 100 | 100 | 100 |
| `/precios.html` | 93 / 3.1 s | 100 / 0.8 s | 100 | **96** (konzolhiba) | 100 |
| `/en/prices.html` | 92 / 2.6 s | 100 / 0.7 s | 100 | 100 | 100 |
| apartman ES / EN | 92–93 / 3.2 s | 100 / 0.7 s | 100 | 100 | 100 |
Megfigyelés: a főoldal mobil LCP-je (6.0 s) a célérték (≤ 2.5 s) fölött van; a hero CSS-háttér (`lcp-discovery`), renderblokkoló betűtípus-CSS. CLS ≈ 0. **A főoldal módosítása Ads-védett → javaslatként marad** (hero `<img>`/`fetchpriority`, önhosztolt font); egyetlen futás zajos, a döntés előtt 3× medián kell.
**axe-core 4.14.1 (WCAG 2.2 AA + best practice, lokális, desktop+mobil, 9 oldal):** 1 hibatípus (fent, javítva). **Töröttlink-ellenőrzés:** 10 oldal, 406 belső hivatkozás, 0 hiba a javítások után. **Nem végezhető/nem végzett:** CrUX/GSC valós adat (nincs hozzáférés), valós eszközös teszt.
