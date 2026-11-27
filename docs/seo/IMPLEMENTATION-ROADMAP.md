# IMPLEMENTATION-ROADMAP

Minden feladat: **ID · leírás · prioritás (H/M/L) · függőség · kockázat · elfogadási kritérium · ellenőrzés · jóváhagyás**.
Szabály: **egyszerre egy fázis**; a következő csak a tulajdonosi jóváhagyás után indul. Egyik fázis sem végez éles deployt.
Jelölések: kockázat `Ads` = érinti a védett Ads-oldalakat; `Low/Med/High`. Jóváhagyás: `O` = tulajdonos, `L` = jogi, `P` = szakmai ellenőrzés.

## P0 — Audit, kutatás, tervezés (KÉSZ, jóváhagyásra vár)
Kimenet: `docs/seo/*`. Nem módosított semmit a weboldalon.

## P1 — Technikai SEO-infrastruktúra
| ID | Feladat | Pri | Függ | Kock. | Elfogadás | Ellenőrzés | Jóv. |
|---|---|---|---|---|---|---|---|
| P1-01 | Tulajdonosi döntések rögzítése (OWNER-INPUT #1–#6: ár-igazság, jogi azonosító, szolgáltatási területek, preview-host, deploy-mód, mérési hozzáférések) | H | – | Low | Minden blokkoló kérdésre írásos válasz a DECISION-LOG-ban | dokumentum-átnézés | O |
| P1-02 | Preview-környezet + indexelés-védelem (noindex meta + `X-Robots-Tag`, jelszó vagy nem nyilvános URL) | H | P1-01 | Low | Preview nem indexelhető; éles érintetlen | curl fejléc-teszt, `site:` ellenőrzés | O |
| P1-03 | Repo-szerkezet: `data/`, `content/`, `templates/`, `tools/`, `tests/`; deploy-kizárás (`docs/`, `tools/`, `tests/`, `data/`) | H | P1-01 | Low | Élesre kerülő fájlok listája = csak publikus | build-manifest | O |
| P1-04 | Központi adatréteg (`data/site.json`, `prices.json`, `services.json`, `areas.json`, `pages/*.json`, kép-nyilvántartás beolvasása) — `DATA-ARCHITECTURE.md` szerint | H | P1-03 | Low | Egy ár egy helyen; build kimutatja az ütközést a meglévő HTML-lel | unit teszt | – |
| P1-05 | Build-szkript (Node, függőségmentes): sablon + adat → statikus HTML; státuszkapu (csak engedélyezett státusz kerül sitemapba/indexre) | H | P1-04 | Low | Determinisztikus kimenet, ismétlés = azonos | diff-teszt | – |
| P1-06 | `assets/seo.css` + komponenskönyvtár (hero, breadcrumb, szerzői doboz, infografika-keret, lightbox, GYIK, CTA-sáv) — `VISUAL-DESIGN-SYSTEM.md` szerint | H | P1-05 | Low (külön CSS) | A `site.css` bájtra változatlan | hash-teszt | O (vizuális) |
| P1-07 | Oldalsablonok T-A…T-I, desktop+mobil, egy *nem publikus* fixture-rel validálva | H | P1-06 | Low | Mind a 9 sablon hibátlanul renderel 360/768/1280 px-en | képernyőkép-teszt + manuális | O |
| P1-08 | Head-generátor: title/description/canonical/hreflang/OG, hreflang párosítás-ellenőrzés | H | P1-05 | Low | Kölcsönös hreflang minden párnál | validátor | – |
| P1-09 | Sitemap-generátor (csak jóváhagyott, canonical, 200-as URL; valós `lastmod`), képsitemap-képesség | M | P1-08 | Low | Sitemap = státuszkapu-halmaz | validátor | – |
| P1-10 | JSON-LD entitásháló (`@id`: Organization, Person, WebSite, Service, Article…) — `STRUCTURED-DATA.md` | M | P1-08 | Low | Érvényes JSON-LD, csak igazolt tartalom | séma-validátor | P |
| P1-11 | Képfeldolgozó pipeline (AVIF/WebP, srcset, EXIF/GPS törlés, méret-sablonok) — `IMAGE-SEO-SPEC.md` | M | P1-04 | Low | Kimeneti kép: nincs GPS, méret a költségvetésen belül | szkript-teszt | – |
| P1-12 | Automatizált validátorok (linkek, képek, alt, title/desc egyediség, kannibalizáció, árva oldal, noindex-szivárgás, státuszkapu) | H | P1-05 | Low | CI/helyi parancs hibát jelez szándékos hibás fixture-ön | tesztfuttatás | – |
| P1-13 | **Ads regressziós teszt**: védett fájlok hash-e, védett oldalak DOM-/képernyőkép-összevetés, `data-cta`/telefon/WhatsApp-href lista | H | P1-03 | Ads | Teszt zöld, ha védett fájl változatlan; piros, ha bármi módosul | futtatás | O |
| P1-14 | Lighthouse/axe baseline (mobil+desktop) a 6 meglévő oldalon + CI-parancsok | M | P1-02 | Low | Dokumentált baseline `PERFORMANCE-STANDARDS`-ben | riport | – |
| P1-15 | Betűtípus-önhosztolás és régi sablon-oldalak (404/gracias/jogi) egységesítése **javaslat** | L | P1-01 | Ads (ha érint) | Csak jóváhagyás után | – | O |
| P1-16 | Ár-ellentmondás (A-C1) és kalkulátor-hiba (A-C2) **javítási csomag** külön ágon | H | P1-01 (#1) | Ads/High | ES/EN árak oldal ugyanazt az ajánlatot mutatja; konzolhiba nincs; WhatsApp-link alapértelmezetten előtöltött | regresszió + manuális | O |

**P1 lezárási kritériumok (összefoglalva):** build + validátorok futnak; védett oldalak bájtra változatlanok; preview él és noindex; sablonok jóváhagyott fixture-rel kész; semmi nincs élesítve.

## P2 — Személyes szakmai márka
P2-01 `/sobre-mi/` + `/en/about/` tartalomterv és szöveg (owner-adatokból) · P2-02 portré/munkafotók (PHOTO-SHOT-LIST P0) · P2-03 bizonyítvány-galéria, visszafordíthatatlan kitakarás · P2-04 szerzői komponens (PG-016-ra linkel) · P2-05 `Person`/`ProfilePage` JSON-LD · P2-06 `/politica-editorial/`. Függ: P1-07, OWNER-INPUT (életút, végzettségek), jogi felülvizsgálat (LGL-07). Jóváhagyás: O + L + P. Elfogadás: nincs igazolatlan állítás; minden kép provenance-szel.

## P3 — IPM és szolgáltatásoldalak
P3-01 PG-011 (IPM/GIP) · P3-02 PG-013 (vapor seco) · P3-03 PG-014 (tratamiento químico) · P3-04 PG-012 (inspección) · P3-05 PG-010 hub · P3-06 IG-01/IG-14/IG-15 infografikák · P3-07 saját fotók beépítése. Függ: P2, fotók (P0/P1 lista), termék-/engedély-ellenőrzés (LGL-05). Jóváhagyás: O + P + L.

## P4 — Lokális SEO
P4-01 PG-020 hub · P4-02 Alicante, Benidorm, Torrevieja ES+EN · P4-03 helyi képek · P4-04 GBP-összehangolás (csak ha van valós profil) · P4-05 2. hullám (Elche, Calpe, Orihuela Costa, Altea) csak adat/kereslet után. Függ: LGL-01/LGL-08, szolgáltatási terület igazolása.

## P5 — GYIK és tudásközpont
P5-01 PG-030 GYIK · P5-02 PG-040 hub · P5-03 1. hullám cikkek (PG-041, 042, 044, 045, 047, 049, 050, 053, 055, 056) · P5-04 2. hullám (043, 046, 048, 051, 054) · P5-05 3. hullám (052, 057, 058, 059) · P5-06 infografikák IG-02…IG-13 · P5-07 belső linkelési audit. Függ: P3, szakmai ellenőrzés, források.

## P6 — Egyedi digitális értékek
P6-01 `/atlas-chinches/` (T-G, 20–35 saját makrofotó) · P6-02 `/identificador-chinches/` (T-I; a logika tulajdonosi jóváhagyással) · P6-03 `/recursos/` + dokumentumok HTML-first, PDF másodlagos · P6-04 ellenőrzőlisták.

## P7 — B2B és esettanulmányok
P7-01 PG-015 · P7-02 PG-060–064 · P7-03 PG-073 + első valós, hozzájárulással dokumentált eset · P7-04 partneri hivatkozások (OFF-PAGE-STRATEGY).

## P8 — Folyamatos optimalizálás
Heti/havi ciklus (SEO-MONITORING §Ritmus), GSC + GA4 összekötés (hozzáférés után), CTR/4–20. pozíció elemzés, tartalom-frissítés, képállomány-bővítés, konkurencia-figyelés, külső linkek.

## Kritikus útvonal
OWNER-INPUT #1–#6 → P1-02/03 → P1-05…P1-13 → (P2 ∥ fotózás) → P3 → P4 → P5 → P6 → P7 → P8.
A fotózás (PHOTO-SHOT-LIST P0) **már most** indítható — nem függ a fejlesztéstől, és ez a leghosszabb átfutású tétel.


---
## Állapot — 2026-11-27 (tulajdonosi jóváhagyás után)
| Feladat | Állapot |
|---|---|
| P0 | kész, commitolva (`9bfc22f`) |
| P0.1 hibajavítások (árak, kalkulátor, a11y, og:image) | **kész**, tesztelve (`5c10490`, `c2c9e3d`) |
| P1-01 döntések | részben (árlogika jóváhagyva; jogi adatok, területek, mérési ID-k nyitva) |
| P1-02 preview | helyi preview (`dist-preview`, noindex) kész; távoli preview-host: tulajdonosi döntés |
| P1-03 repo-szerkezet + deploy-kizárás | **kész** (`package-site.mjs`, allowlist) |
| P1-04 adatréteg | **kész** (`site/prices/whatsapp/images/pages`) |
| P1-05 build + státuszkapu | **kész** |
| P1-06 `seo.css` + komponensek | **kész** |
| P1-07 9 sablon fixtúrával | **kész**, böngészőben validálva (360/768/1280, ES+EN, axe, lightbox, eszköz) |
| P1-08/09 head, hreflang, sitemap | **kész** (sitemap az éles fájlra épít, jóváhagyott oldalakkal bővül) |
| P1-10 JSON-LD | **kész** (@graph, @id-hivatkozás-ellenőrzés; FAQPage nincs) |
| P1-11 képpipeline | **kész** (szintetikus 6000×4000 GPS-es teszttel igazolva) |
| P1-12 validátorok / minőségkapu | **kész** (`validate.mjs`) |
| P1-13 Ads-regressziós teszt | **kész** (`test-ads-protection.mjs`, baseline `c2c9e3d`) |
| P1-14 Lighthouse/axe baseline | **kész** (éles baseline; új oldalak: helyi) |
| P1-15 régi sablonok egységesítése | javaslat marad |
| P1-16 A-C1/A-C2 javítás | **kész** |
| P2 Sobre mí | piszkozat (blokkolt: OWNER-INPUT #13–#24, fotók, LGL-07) |
| P3 szolgáltatások | piszkozat: hub, IPM, vapor seco, tratamiento químico (blokkolt: #7–#12, fotók, LGL-05) |
| P4 lokális | **nem indult** (blokkolt: #3 szolgáltatási területek, LGL-01/08) |
| P5 GYIK | piszkozat (valós, élő oldali kérdésekből); tudásközpont-cikkek **nem indultak** (ellenőrzött források + szakmai ellenőr + fotók kellenek) |
| P6–P8 | **nem indultak** (P6 fotók, P7 valós esetek/ajánlat, P8 GSC/GA4 hozzáférés) |
