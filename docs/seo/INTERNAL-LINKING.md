# INTERNAL-LINKING — belső linkelés és topic-cluster

## 1. Szabályok
- Linkek **természetes szövegkörnyezetben**; változatos horgonyszöveg; nincs ismételt exact-match anchor („chinches Alicante” sorozat).
- Minden indexelhető oldal ≥ 2 feltérképezhető bejövő HTML-linkkel (build-ellenőrzés); árva oldal nincs.
- A **főoldalra nem kerül új navigációs blokk**; a hubok a láblécből (jóváhagyással, D-008) és a hub-oldalakról érhetők el.
- Oldalanként 3–8 kontextuális belső link; a hub-oldalak 10–30.
- Linkek ES↔ES, EN↔EN; nyelvváltó az egyetlen keresztnyelvi link (+ hreflang).

## 2. Kapcsolati mátrix
| Honnan | Hova | Megjegyzés |
|---|---|---|
| Cikk (T-C) | releváns szolgáltatás (PG-011/012/013/014) | 1 kontextuális link, visszafogott CTA |
| Cikk | kapcsolódó cikk (2–3), szerző (`/sobre-mi/`), atlasz/identificador (ha releváns) | |
| GYIK | részletes útmutató (kategória-mélylink, FAQ-STRATEGY §2) | |
| Szolgáltatás | IPM (PG-011), árak (`/precios.html`), szakmai profil (PG-016), kapcsolódó cikk | |
| Lokális oldal | releváns szolgáltatások, szomszédos területek, `/zonas/`, árak | |
| Atlasz | felismerési cikk (041), életciklus (043), identificador (071) | |
| Esettanulmány | alkalmazott kezelés, település | |
| B2B oldal (015) | apartman-oldal (003), cikkek 060–064, dokumentumok (072) | |
| Dokumentum (PG-072) | kapcsolódó HTML-tartalom | a PDF nem helyettesíti a HTML-t |
| Hub (010, 020, 030, 040, 072) | minden gyermek | természetes rövid leírással |
| Új oldalak → védett oldalak | természetes hivatkozás (`/precios.html`, apartman-oldal) | megengedett |
| Védett oldalak → új oldalak | csak jóváhagyott lábléc (D-008) | |

## 3. Topic-clusterek
| Cluster (pillér) | Tagok |
|---|---|
| **Felismerés** (041) | 042, 044, 045, 046, 043, atlasz 070, identificador 071 |
| **Kezelés** (049) | 050, 051, 052, 053, 054, PG-011/013/014 |
| **Előtte/utána** (055/056) | 057, 058, 072 |
| **Megelőzés** (047) | 048, 059, 060, 015 |
| **B2B** (015) | 061, 062, 063, 064, 003, 072 |
| **Lokális** (020) | 021–027 ↔ egymás (szomszédok), árak, szolgáltatások |

## 4. Ellenőrzés
Build: link-gráf export (CSV): oldal, bejövő/kimenő darab, horgonyszöveg-eloszlás; hiba: 0 bejövő link, > 3 azonos horgony ugyanarra az URL-re, törött link; havi manuális átnézés (SEO-MONITORING).

## Megvalósítva (P1/P2–P7 piszkozatok, 2026-11-27)
- Linkforrások: `related` (a `data/pages/*.json`-ban), hub-blokkok (`type: hub`), kontextuális HTML-linkek a cikkszövegekben, a fejléc/lábléc (a build-ben szereplő oldalak: Servicios, Guía, Preguntas, Sobre mí), szerzői doboz (→ Sobre mí), forráslista alatti „Política editorial” link, GYIK-hub.
- Ellenőrzés: `tools/validate.mjs` (törött link, hiányzó horgony, **≥ 2 bejövő link**), és a fejlesztői oldalindex (`/__dev/index.html`, `/__dev/links.json`: oldalanként bejövő/kimenő linkek). Jelenleg a 80 generált oldalfájlból **mindegyiknek ≥ 2 bejövő linkje van**.
- A főoldalra és a védett oldalakra **nem** került link (D-008, jóváhagyás kell): az új rendszer a saját hubjaiból és navigációjából érhető el.
