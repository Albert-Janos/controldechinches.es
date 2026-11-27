# IMAGE-SEO-SPEC — képoptimalizálási specifikáció

Csak az **új** oldalakra vonatkozik (a meglévők érintetlenek). A pipeline a P1-ben épül (`tools/`), a nyers fájlokból a publikus kimenetet állítja elő.

## 1. Formátum és méret
| Képtípus | Formátum | Szélességek (srcset) | Minőség (kiindulás) | Max. célméret |
|---|---|---|---|---|
| Hero (fekvő) | AVIF + WebP (+ JPEG fallback a `<picture>`-ben) | 640, 960, 1280, 1600, 2000 | AVIF q≈50 / WebP q≈75 | ≤ 140 KB @1600 |
| Tartalmi fotó | AVIF + WebP | 480, 800, 1200, 1600 | ugyanaz | ≤ 90 KB @1200 |
| **Makró / azonosító kép** | WebP q≈85 (+ AVIF q≈60) | 800, 1200, 1600, 2400 | **magasabb minőség**; nincs agresszív élesítés | ≤ 220 KB @1600 — a részletek (pronotum, szemek, varratok) a prioritás |
| Dokumentum (bizonyítvány) | WebP lossless-near + nagyítható változat | 800, 1600 | q≈88 | ≤ 250 KB nagyítva |
| Infografika | SVG (SVGO), PNG csak fallbackként | – | – | ≤ 40 KB |
| Ikon | SVG sprite | – | – | – |

Nincs egységes tömörítési beállítás: a makrók és okmányok külön profilt kapnak (a szakmai részlet megőrzése).

## 2. HTML
- `<picture>` + `srcset` + `sizes` (a tényleges elrendezéshez igazítva), **`width` és `height` kötelező** (CLS = 0).
- LCP-kép (hero): `fetchpriority="high"`, **nincs** `loading="lazy"`, előtöltés `<link rel="preload" as="image" imagesrcset imagesizes>`; a hero ne CSS-háttér legyen (a böngésző korán lássa). Hajtás alatt: `loading="lazy"` + `decoding="async"`.
- Mobilra külön kivágás (art direction `<source media>`), a `IMAGE-ASSET-INVENTORY.csv` `mobile_crop` oszlopa szerint.
- Dekoratív kép: `alt=""`. Informatív kép: pontos ES és EN alt (a map/inventory oszlopai); a képaláírás `<figure><figcaption>`.
- Alt: leíró és tényszerű, nincs kulcsszó-tömés, nem ismétli a képaláírást szó szerint.

## 3. Fájlnév
Természetes, ékezet nélküli, kisbetűs, kötőjeles, beszédes (inventory `optimized_filename`), pl. `vapor-seco-costura-colchon-1600.avif`. Egyedi tartalomhoz egyedi név; újrahasználat = ugyanaz a fájl.

## 4. Metaadat és jog
- **Publikus fájlból törlendő:** GPS, készülék-/kameraazonosító, szerzői személyes adat, eredeti fájlnév. A szerzői jogi információ nyilvántartása az inventoryban (author, rights).
- IPTC/XMP: opcionálisan *Creator* és *Copyright Notice* a publikus fájlban ("© Control de Chinches / Albert János" — a jogi nyilatkozat után).
- Okmányok: személyes adat **visszafordíthatatlan** kitakarása a nyers képen (nem réteg, nem metaadat), ellenőrzés kézzel a kimeneten; az eredeti csak `_archive-private/`-ban.

## 5. Kereshetőség
- Minden tartalmi kép feltérképezhető `<img>`-ként (nem CSS-háttér, nem JS-injektálás).
- **Képsitemap** (`image:image`) a hero és azonosító képekhez (P1-09), csak publikus, indexelhető oldalakhoz.
- `ImageObject` JSON-LD az atlasz- és makrófotókhoz, szerző + licenc-oldal (STRUCTURED-DATA); a képek önálló indexelhető oldalt **nem** kapnak (atlasz = lightbox, egy oldal).
- Képaláírás tartalmaz fajt/stádiumot csak ellenőrzés után (az addigi: „ellenőrizendő”).

## 6. Ellenőrzés (build-time)
Hiányzó alt, hiányzó width/height, nem létező fájl, túl nagy fájl (profil szerint), nem optimalizált formátum, GPS-metaadat a kimeneten, `loading=lazy` a hero-n, 2000 px-nél kisebb eredeti hero → hibaüzenet (SEO-QUALITY-GATE).

## Megvalósítás: `tools/process-images.mjs` (P1)
Sharp-alapú; 15–30 MB-os JPG/JPEG/PNG eredetit is kezel (egy master átméretezés, abból a változatok). **Soha nem ír a `raw-images/` mappába** (a kimenet a nyers mappán belül megtagadva). Profilok: *hero* (640–2000 px, WebP q76 + AVIF q50, + 4:5 mobil-kivágás 480/800), *content* (480–1600), *macro* (800–2400, WebP q86 + AVIF q62, élesítés nélkül), *document* (800/1600, WebP q88), *thumb* (320–960). Minden metaadat (EXIF/GPS/XMP/IPTC) törlődik (`verify` ellenőrzi); forgatás a kimenetre beégetve. Jóváhagyott (`approved=yes`) kép → `assets/img/<kategória>/`, egyébként `_pending-images/` (nem csomagolt). Hozzárendelés: `data/images-assign.csv` (fájl, SHA, kép-ID, jogok, szerző, helyszín, dátum, léptek, ES/EN alt és képaláírás, megjegyzés). A kép-nyilvántartás (`IMAGE-ASSET-INVENTORY.csv`) automatikusan frissül; az oldalak képhelye azonosítóhoz kötött, a valódi kép megjelenése csak a manifest újraépítését igényli.
