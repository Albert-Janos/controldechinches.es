# ADS-PROTECTION — a Google Ads landingek védelme

Ez a dokumentum a **kötelező védelmi szabályok** forrása; a többi dokumentum ide hivatkozik. Baseline: git commit `3c4f9f6` ("Initial website baseline before SEO development"), élő oldal 2026-11-27.

## 1. Védett (nem módosítható előzetes, kifejezett tulajdonosi jóváhagyás nélkül)
**Oldalak:** `/`, `/en/`, `/precios.html`, `/en/prices.html`, `/chinches-apartamentos-turisticos/`, `/en/bed-bugs-holiday-rentals/` — teljes tartalom, hero, CTA-k, árak, szövegek.
**Fájlok:** `assets/site.css`, `assets/menu.js`, `js/main.js`, `js/landing.js`, `js/measurement-config.js`, `.htaccess`, `robots.txt`, `sitemap.xml`, a meglévő `assets/*` képek, `favicon/*`, logó.
**Adatok/elemek:** telefonszám `+34605259206` és minden `tel:` link; minden `wa.me/34605259206?text=…` link és üzenetszöveg; `data-cta` és `data-page` attribútumok; konverziós események (`whatsapp_click`, `phone_click`); CMP/consent logika (`cdc_privacy_v2`, Consent Mode alapértelmezés); mérési ID-k helye (`measurement-config.js`); árak és tarifák (főoldal, árak oldal, `landing.js` ráták); URL-ek (törlés/átnevezés tilos); AI-diszpécser (élő rendszer — **nem érintjük**); production deploy; automatikus publikálás.
**Globális CSS:** a `site.css` tilos; az új oldalak `assets/seo.css`-t használnak, `.sx-` előtaggal; nem írják felül a `site.css` szelektorait.

## 2. Engedélyezett (jóváhagyás nélkül is, külön ágon, Preview-ban)
Új fájlok és új könyvtárak (`/servicios/`, `/zonas/` …), új CSS/JS fájlok, `docs/`, `tools/`, `tests/`, `data/`. Minden új oldal `noindex` + `Draft` státusszal indul.

## 3. Jóváhagyást igénylő, de szükséges változtatások (külön PR, külön teszt)
| # | Változtatás | Miért kell | Kockázat |
|---|---|---|---|
| 1 | `sitemap.xml` kibővítése új, jóváhagyott URL-ekkel | indexelés | alacsony (új sorok) |
| 2 | Lábléc hub-linkek a főoldalon és a védett oldalakon (D-008) | belső linkelés | közepes (Ads-oldal DOM) |
| 3 | A-C1/A-C2 javítása (`precios.html`, `landing.js`) | ár-ellentmondás, JS-hiba | **magas** |
| 4 | HSTS bekapcsolása, `/precios` → `/precios.html` 301 | technikai | alacsony–közepes |
| 5 | Főoldali bizalomépítő/„Sobre mí” szekció | CRO | **külön CRO-jóváhagyás** |
| 6 | Betűtípus-önhosztolás | adatvédelem/teljesítmény | közepes (globális) |

## 4. Regressziós teszt (P1-13)
- **Bájt-védelem:** minden védett fájlra `git diff --quiet 3c4f9f6 -- <fájl>` (sorvég-független) — kell: nulla eltérés. Információként az SHA-256 a munkafában (Windows, 2026-11-27):

| Fájl | SHA-256 (munkafa) |
|---|---|
| index.html | e2296448c550fada… |
| en/index.html | c0ee4ff4b6222fa8… |
| precios.html | 10ca12c897402e64… |
| en/prices.html | 638adbd0967a0045… |
| chinches-apartamentos-turisticos/index.html | 72bdaf3613433f9d… |
| en/bed-bugs-holiday-rentals/index.html | ff16971e1345209… |
| assets/site.css | 5a894472377d940e… |
| js/main.js | 7487fc811c6681cd… |
| js/landing.js | d4bff9f950157187… |
| js/measurement-config.js | 330aaf7df04e171b… |
| .htaccess | 4265f7af95c6496a… |

(A teljes hash-lista a P1-13 tesztfixtúrába kerül; a hash sorvég-függő, a git-diff nem.)
- **DOM/viselkedés:** a 6 védett oldal képernyőképe 360/768/1280 px-en; a `a[data-cta]` linkek száma és `href`-je; a telefon- és WhatsApp-linkek listája változatlan; a H1, hero-ár (`139 €`), CTA-szövegek változatlanok; konzol-hibák száma nem nő (jelenleg 1: A-C2).
- **Mérés:** `measurement-config.js` változatlan; `main.js` tracking-szakasz változatlan; az új oldalak a **meglévő** `data-cta` konvenciót használják (D-009).
- **Éles-egyezés:** a preview-ból a védett fájlok egyeznek az éles állapottal (curl-hash).

## 5. Új oldalak és az Ads-oldalak viszonya
- Új SEO-oldalak NEM rontják a landing-élményt: nincs új navigációs blokk a főoldalon, nincs átirányítás védett oldalakról, nincs megosztott CSS-szelektor.
- A kanonikus és hreflang-rendszer a védett oldalakat **olvassa**, nem írja.
- Az új oldalakról a védett oldalakra linkelni szabad (természetes szövegkörnyezetben), a fordított irányt csak a 3. táblázat szerint.

## 6. Incidens-szabály
Ha bármely teszt védett eltérést jelez: a változtatás nem megy tovább; tulajdonos értesítése; visszaállítás a baseline-ra (`git restore`); DECISION-LOG bejegyzés.
