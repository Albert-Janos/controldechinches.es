# DATA-ARCHITECTURE — single source of truth

## 1. Jelenlegi állapot [kód]
Az üzleti adatok a HTML-ben vannak szétszórva: telefonszám ~47 előfordulás 7 fájlban; **8 különböző WhatsApp-előtöltött szöveg** (16×, 8×, 3×, 3×, 1×…); árak 5 HTML-ben + `js/landing.js` ráták (`esencial 139/179/219/259 +40`, `completo 239/289/339/399 +50`, vapor 80, kanapé 40, ULV 50); szolgáltatási terület 3 helyen 3 változat; JSON-LD kézi. Egy ár módosítása ≥ 5 fájl kézi szerkesztése, és **már most ellentmondás van** (A-C1).

## 2. Cél-szerkezet (P1-04)
| Fájl | Tartalom |
|---|---|
| `data/site.json` | márka, domain, telefonszám, WhatsApp-szám, e-mail (ha van), nyelvek, `@id`-k, jogi státusz |
| `data/prices.json` | tervek (Esencial, Completo), dormitorio-tábla, kiegészítők (vapor, kanapé, ULV), `status: pending-owner-decision`, `validFrom`, `source` |
| `data/services.json` | szolgáltatások (slug, név ES/EN, állapot, kapcsolódó oldal) |
| `data/areas.json` | települések: `confirmed: true/false`, kiszállási szabály, oldal-státusz |
| `data/professional.json` | képesítések, dokumentum-ID-k (`IMAGE-ASSET-INVENTORY`), `publishable`, `verified` |
| `data/pages/<id>.json` | PAGE-INVENTORY-sor + státusz + szekciók + belső linkek + források |
| `data/sources.json` | szakmai források (cím, kiadó, év, URL, ellenőrzés dátuma) |
| `IMAGE-ASSET-INVENTORY.csv` / `PAGE-IMAGE-MAP.csv` | képnyilvántartás (már létezik) |

## 3. Szabályok
- **Nincs párhuzamos árlista.** Az árak csak `prices.json`-ból kerülnek az új oldalakra (kivonat, `Offer`, kalkulátor-link).
- Az ár/telefon/WhatsApp módosítása = **egy adatsor** + build; az új oldalak automatikusan frissülnek.
- **A védett oldalak nem generáltak** (passthrough). Összhang-ellenőrzés: `tools/check-consistency.mjs` **csak olvas** — a védett HTML-ekből kinyeri az árakat/telefont/WhatsApp-szöveget, összeveti a központi adattal, és eltérést jelent (A-C1-et már most kimutatná). Javítás = jóváhagyott PR (ADS-PROTECTION §3).
- Az `areas.json` `confirmed:false` települése nem kap oldalt, nem kerül `areaServed`-be.
- Státusz-meta: `status` csak a LEGAL-PUBLICATION-GATES láncából.

## 4. AI-diszpécserrel való konzisztencia
A diszpécser adatai a repóban **nincsenek**; az élő rendszert nem érintjük. Teendő: a tulajdonos read-only exportot ad (OWNER-INPUT #6) → `tools/compare-dispatcher.mjs` egyszeri riport (ár, terület, nyelv, foglalási szabály) → eltérés = tulajdonosi döntés. Hosszú távon: közös forrásfájl (a diszpécser konfigja és `data/*.json` ugyanabból) — ehhez a diszpécser-szolgáltató lehetőségei és külön jóváhagyás kell.

## 5. Adminisztrációs rendszer (későbbi)
Az esettanulmányok és a konverziók összekötése csak *piszkozat/riport* szintű (CASE-STUDY-STANDARD, CONVERSION-MEASUREMENT §5); automatikus publikálás nincs.

## Frissítés (2. munkacsomag)
- `data/prices.json`: **nettó** árak + `vat` (arány, megjelenítési mód, státusz) + `extras` + `terms`; a régi `addons` csak a védett kalkulátort szolgáló `js/prices.js` generátorának marad.
- `templates/prices.mjs`: fogyasztói ár (nettó × (100+IVA %) centben), formázás ES/EN, tokenek: `{{price:KEY}}`, `{{net:KEY}}`, `{{vat}}`, `{{url:PG-xxx}}`. Oldal-adatban kézzel írt ár tilos (teszt).
- `data/site.json`: `dispatcher` (hívás) és `whatsapp` külön; `serviceAreas` (18 település, kiemelt lista, városi oldalak); `person` (kezdet 2023, képesítés 2026, nyilvántartási szám rejtve).
