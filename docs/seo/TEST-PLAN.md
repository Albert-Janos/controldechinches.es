# TEST-PLAN

A SEO-QUALITY-GATE minden pontjához tartozó ellenőrzési módszer + a fázisok regressziós tesztjei. Dokumentált eredmények: `reports/tests/<dátum>-<fázis>.md`.

## 1. Tesztrétegek
| Réteg | Eszköz | Mikor | Eredmény |
|---|---|---|---|
| **Ads-regresszió** (védett fájlok, DOM, képernyőkép, `data-cta` lista, konzolhibák) | `git diff --quiet 3c4f9f6 -- <védett>` + Playwright/képernyőkép + DOM-export | minden build/PR | kötelezően zöld |
| Build-validátorok (linkek, meta, hreflang, canonical, sitemap, képek, séma, árva, kannibalizáció, noindex-szivárgás) | `tools/validate-*.mjs` | minden build | kötelezően zöld |
| Állapotkapu-teszt (Draft nem kerül sitemapba/indexre) | negatív fixtúrák (`tests/`) | minden build | hibát kell jeleznie |
| Képernyőkép-/vizuális teszt | Playwright 360/768/1280, világos/sötét | sablonváltozásnál | emberi jóváhagyás |
| Teljesítmény | Lighthouse CI (mobil+desktop), 3× medián | heti + PR | PERFORMANCE-STANDARDS |
| Akadálymentesség | axe-core + manuális (billentyű, NVDA, VoiceOver) | oldalankénti kapuk | ACCESSIBILITY-STANDARDS |
| Funkcionális | CTA-linkek (`wa.me`, `tel:`), kalkulátor-link, nyelvváltó, lightbox, identificador | oldalankénti | kattintásos teszt |
| Mérés | esemény-küldés consent-tal és anélkül (DevTools Network) | új sablonnál | `whatsapp_click`/`phone_click` helyesen |
| Struktúrált adat | JSON-parse + Rich Results Test + Schema Validator | séma-változásnál | hibamentes |
| Szakmai/tartalmi | szakmai ellenőr + nyelvi lektor | oldalanként | `Professional review passed` |
| Jogi | LGL-kapuk | tranzakciós oldalak | `Owner approved` előtt |
| Cross-device | valódi iOS + Android + Windows/Chrome/Safari/Firefox | P1 záráskor és új sablonnál | feljegyzés |

## 2. A P0-ban végzett ellenőrzések (alap)
HTTP-státuszok/redirectek curl-lel (2026-11-27); az élő `index.html` és a repó egyezése; konzolhiba az ES árak oldalon (A-C2); böngészős időmérés (nem Lighthouse). Hiányzik: Lighthouse, axe, valós eszköz-teszt, kattintásos kalkulátor-teszt (A-C2 hatása).

## 3. P1 átvételi tesztjei
P1-13 Ads-regresszió zöld · P1-12 validátorok zöldek szándékosan hibás fixtúrán piros · sablon-fixtúra mind a 9 sablonon 3 méreten hibátlan · preview `noindex` és `X-Robots-Tag` (curl) · build ismételhető (azonos kimenet) · nincs élesbe menő változtatás.

## 4. Hibakezelés
Védett-regresszió → azonnali stop és visszaállítás (ADS-PROTECTION §6); egyéb hiba → hibajegy a riportban, a státusz nem lép előre.
