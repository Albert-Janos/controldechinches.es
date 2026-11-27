# SITE-ARCHITECTURE — végleges információs architektúra (P0 terv)

Adatforrás: `PAGE-INVENTORY.csv` (minden mező ott). Ez a dokumentum a szerkezetet és az **eltéréseket a mestertervtől** indokolja. A közös szabályok: ADS-PROTECTION, TECHNICAL-SEO-SPEC, MULTILINGUAL-SEO.

## 1. Alapelvek
1. **Meglévő URL-ek érinthetetlenek** (D-001): `/`, `/en/`, `/precios.html`, `/en/prices.html`, `/chinches-apartamentos-turisticos/`, `/en/bed-bugs-holiday-rentals/`, jogi oldalak.
2. Új ES oldalak: `/mappa/` formátum (záró perjel), kisbetű, ékezet nélkül. EN: `/en/<angol-slug>/`, **nem** ES-slug lefordítva, hanem önálló kulcsszó-alapú.
3. Egy elsődleges szándék = egy URL (kannibalizáció-védelem, KEYWORD-RESEARCH).
4. Vékony oldal tilos: új URL csak ha van önálló szándék + saját tartalmi érték + valós adat. Különben szekció egy meglévő oldalon.
5. Publikálás státuszkapukon át (LEGAL-PUBLICATION-GATES, SEO-QUALITY-GATE); a sitemap csak „Approved for indexing”/„Published” oldalakat tartalmaz.

## 2. Végleges fa (ES / EN)

```
/                                   /en/                                  [meglévő, védett]
/precios.html                       /en/prices.html                       [meglévő, védett]
/chinches-apartamentos-turisticos/  /en/bed-bugs-holiday-rentals/         [meglévő, védett]
/servicios/                         /en/services/                         PG-010 hub
  /servicios/control-integrado/       /en/services/integrated-pest-management/   PG-011  (GIP/IPM – egyetlen módszertani oldal)
  /servicios/inspeccion-diagnostico/  /en/services/inspection-diagnosis/         PG-012
  /servicios/vapor-seco/              /en/services/dry-steam/                    PG-013
  /servicios/tratamiento-quimico/     /en/services/chemical-treatment/           PG-014
  /servicios/planes-prevencion/       /en/services/prevention-programmes/        PG-015  (B2B: monitorización + oktatás + dokumentáció)
/sobre-mi/                          /en/about/                            PG-016
/politica-editorial/                /en/editorial-policy/                 PG-017
/zonas/                             /en/areas/                            PG-020 hub
  alicante, benidorm, torrevieja    (1. hullám, PG-021..023)
  elche, calpe, orihuela-costa, altea  (2. hullám, PG-024..027)
/preguntas-frecuentes/              /en/faq/                              PG-030
/guia-chinches/                     /en/bed-bug-guide/                    PG-040 hub + 25 cikk (PG-041..065)
/atlas-chinches/                    /en/bed-bug-atlas/                    PG-070
/identificador-chinches/            /en/bed-bug-identifier/               PG-071
/recursos/                          /en/resources/                        PG-072
/casos-reales/                      /en/case-studies/                     PG-073 (csak valós, hozzájárulással dokumentált esetekkel élesedik)
```
Új oldalpár: 47 → ~94 URL + 6 meglévő. **Nem egyszerre**: fázisokban (IMPLEMENTATION-ROADMAP). Segédoldalak (noindex): `gracias.html`, `404.html` — változatlan.

## 3. Eltérések a mestertervtől és indoklásuk

| Mestertervben | Döntés | Indok |
|---|---|---|
| `/precios/` | **marad `/precios.html`** | Védett Ads-URL; átnevezés tilos és felesleges kockázat. |
| `/apartamentos-turisticos/` | **marad `/chinches-apartamentos-turisticos/`** | Létező, nem duplikáljuk. |
| `/contacto/` | **nem hozzuk létre (P1–P4)** | A kapcsolat minden oldalon CTA-ként és láblécben van; külön oldal vékony lenne. Akkor készül, ha a jogi azonosító adatok/NAP/GBP miatt kell (owner döntés). |
| `/metodologia/` | **összevonva** → `/servicios/control-integrado/` | A módszertan és az IPM ugyanaz a szándék (D-003). |
| 11 szolgáltatás-aloldal | **5 oldal + szekciók** | `tratamiento-combinado`, `monitorizacion-seguimiento`, `prevencion-reinfestaciones`, `sellado-grietas`, `asesoramiento-tecnico`, `formacion-personal` → szekciók a PG-011 / PG-015 oldalon (stabil `#id` horgonyokkal), ahol külön szándék van, ott tudásközpont-cikk (PG-059, 060, 063). Később kiválhat, ha GSC-adat indokolja. |
| Ügyféltípus-oldalak (8) | **nincs külön oldal** | Lakás = főoldal; apartman = meglévő; szálloda/hostal/üzemeltető = PG-015 + PG-061/062; takarító = PG-063; társasház = PG-065 (csak ha a szándék igazolt). |
| Településoldalak 2. és 3. hullám | 2. hullám feltételes; 3. (Dénia, Jávea…) **nincs tervezve** | Csak igazolt kiszolgálási terület + hely-specifikus tartalom + kereslet-adat. |
| Tudásközpont „több száz téma” | **25 cikk** | Azonos szándékú témák összevonva (pl. csípés+bolha, peték+nimfák → életciklus + atlasz). |

## 4. Navigáció
- **Főoldalon nincs új navigációs blokk.** Az új rendszer a láblécből, a hub-oldalakról és szövegkörnyezetből érhető el.
- Lábléc-javaslat (**jóváhagyást igényel**, mert a főoldal módosítása): Szolgáltatások · Zónák · Guía · Atlasz · Rólam · GYIK. Alternatíva jóváhagyásig: a hubok linkelve a meglévő `/precios.html`-ről és az apartmanoldalról **nem** (azok is védettek) → ezért a lábléc-módosítás külön owner-döntés (D-008).
- Az új oldalak saját fejléc/lábléc sablont használnak (ugyanaz a vizuális arculat), teljes ES↔EN nyelvváltóval, valódi megfelelő oldalra.
- Morzsa (breadcrumb) minden új oldalon, HTML + `BreadcrumbList`.
- Szülő–gyerek: cikk → hub → főoldal; árva oldal tilos (build-time ellenőrzés: minden oldalnak ≥ 2 bejövő feltérképezhető linkje).

## 5. URL- és átirányítási szabály
- Végleges, kanonikus forma: ES `/…/`, EN `/en/…/`. `.html` csak a meglévő két árak-URL.
- Új oldal sosem kap `.html`-t. Slug később nem változik; ha mégis, 301 egy lépésben (`.htaccess` szabály az owner jóváhagyásával, Ads-URL-eket nem érint).
- A `/precios` (kiterjesztés nélkül) 404-et ad — **nem módosítjuk**; opcionális 301 → `/precios.html` jóváhagyással (P1 javaslat, alacsony kockázat).

## 6. Indexelési kapuk
Státusz → sitemap/robots/meta robots:
`Draft`…`Owner approved` = `noindex` + nincs sitemap; csak `Approved for indexing` / `Published` = `index` + sitemap. Preview környezet mindig `noindex` + HTTP `X-Robots-Tag`.
