# SEO-QUALITY-GATE

Egyetlen új oldal sem léphet `Approved for indexing` / `Published` státuszba, amíg minden **alkalmazandó** pont teljesül. A–auto = build/CI ellenőrzi (P1-12); M = emberi ellenőrzés; O = tulajdonosi jóváhagyás. A kapu kimenete oldalanként egy riport (`reports/gate/<page-id>.md`), amelyet a tulajdonos lát.

| # | Ellenőrzés | Mód |
|---|---|---|
| 1 | Egyértelmű keresési szándék, `KEYWORD-URL-MAP` szerinti egyedi elsődleges kulcsszó (nincs kannibalizáció) | auto + M |
| 2 | Önálló tartalmi érték (saját fotó/ábra/megfigyelés; nem sablon-csere) | M |
| 3 | Szakmai pontosság, ellenőrzött források (forrásnapló kitöltve, ellenőrzés dátuma) | M (szakmai ellenőr) |
| 4 | Valós szolgáltatási információk (OWNER-INPUT-ból) | M + O |
| 5 | Egyedi title, egyedi meta description (hosszak) | auto |
| 6 | Egyértelmű H1, logikus H2–H3 | auto |
| 7 | Helyes canonical, kölcsönös hreflang, `html lang` | auto |
| 8 | Működő belső linkek, nincs árva oldal, nincs törött link | auto |
| 9 | Releváns, megfelelő minőségű képek; **jóváhagyott képanyag**; felhasználási jogok rendben; provenance-nyilatkozat | M + O |
| 10 | Alt szövegek (ES/EN), képaláírások, optimalizált képek (formátum, méret, width/height, nincs GPS) | auto |
| 11 | Mobil és desktop megjelenés hibamentes (360/768/1280, képernyőkép-teszt + manuális) | auto + M |
| 12 | Működő CTA-k (WhatsApp/telefon), `data-cta` jelen van, linkek helyes számra mutatnak | auto |
| 13 | Működő konverziómérés (esemény-küldés a meglévő `main.js`-sel; consent-viselkedés) | auto + M |
| 14 | Strukturált adatok érvényesek, csak igazolt tartalmat jelölnek | auto + M |
| 15 | Sitemap-egyezés (csak jóváhagyott/kanonikus/200); `robots` helyes; indexelhetőség | auto |
| 16 | HTTP-státusz (200; nincs soft 404; redirectek egy lépésben) | auto |
| 17 | Adatvédelmi megfelelés (nincs új harmadik fél consent nélkül; jogi oldalak linkelve) | M + L |
| 18 | Szakmai jogosultságok/állítások ellenőrzése (LGL-01…10 kapuk) | L |
| 19 | **Ads landing regressziós teszt zöld** (ADS-PROTECTION §4) | auto |
| 20 | Teljesítmény/a11y: Lighthouse SEO 100, Perf mobil ≥ 90, a11y ≥ 95; axe hiba 0 | auto |
| 21 | Tartalmi stílus (nincs tiltott állítás/„profesional”-túlhasználat; ES/EN lektorálva; magyar jelentés jóváhagyva) | M + O |
| 22 | Tulajdonosi jóváhagyás (írásban, DECISION-LOG) | O |

**Státuszlépések:** Draft → Content ready (1–4, 21) → Visual assets ready (9, 10) → Technical QA passed (5–8, 10–16, 19, 20) → Professional review passed (3) → Legal review (17, 18, ha előírt) → Owner approved (22) → Approved for indexing → Published (a deployt a tulajdonos végzi).
A szubjektív vizuális és szakmai minőséghez mindig emberi ellenőrzés kell; az automatizmus nem helyettesíti.
