# MEASUREMENT-INTEGRATION — Google Ads / GA4 / GTM későbbi csatlakozási pontok

Állapot (2026-11-28): **semmilyen mérőrendszer nincs telepítve vagy konfigurálva.** Nincs GA4-azonosító, Ads-azonosító, GTM-container vagy konverziós címke; nem használtam magyarországi weboldalak kódjait; nem találtam ki azonosítót. `js/measurement-config.js` üres (`ga4Id: ''`, `adsId: ''`, `whatsappLabel: ''`, `phoneLabel: ''`), a `tests/test-ads-protection.mjs` ellenőrzi.

## Hol lehet később egy helyen bekapcsolni
1. **Azonosítók**: `js/measurement-config.js` (a meglévő, védett infrastruktúra). A `js/main.js` Consent Mode v2 „denied” alapértelmezéssel, `ads_data_redaction`-nel, személyre szabás nélkül tölti be a címkét, **csak** ha van azonosító és hozzájárulás. Minden oldal (régi és új) ugyanazt a `/js/main.js?v=7` modult tölti be, ezért az egy helyen megadott konfig mindenhová eljut.
2. **Eseményhorog (új)**: `js/track.js` — `track(name)` egy `cdc:track` DOM-eseményt küld **csak az esemény nevével** (fehérlistás), adattartalom nélkül. A jövőbeli integráció egyetlen figyelőt tesz fel: `window.addEventListener('cdc:track', e => …e.detail.name…)` (hozzájárulás után).
3. **Deklaratív horog**: `data-track="…"` attribútum + `data-cta`/`data-page` (meglévő konvenció).

## Technikailag azonosítható események
| Esemény | Forrás | Megjegyzés |
|---|---|---|
| Normál WhatsApp-kattintás | `a[href*="wa.me"][data-cta]` → `js/main.js` `whatsapp_click` | A validátor hibát jelez, ha `wa.me`/`tel:` link `data-cta` nélkül marad |
| Telefonhívás-kattintás | `a[href^="tel:"][data-cta]` → `phone_click` | |
| Kalkulátor használata | `track('calculator_use')` (`js/landing.js`) | első interakció |
| Kalkuláció befejezése | `track('calculator_complete')` | település kiválasztva = teljes ajánlat |
| Kalkulált ajánlat WhatsApp-továbbítása (kezdeményezés) | `track('quote_whatsapp_start')`, `data-track="quote_whatsapp"` | |
| Észlelési adatlap WhatsApp-továbbítása (kezdeményezés) | `track('detection_form_whatsapp_start')` (`js/detect.js`) | |
| PDF-letöltés | `data-track="pdf_download"` / `track('pdf_download')` | 12 statikus PDF + kitöltött PDF |

## Szabályok
- A WhatsApp megnyitása **nem** bizonyított elküldött üzenet vagy megrendelés; csak szándékjelzés.
- **Személyes adat nem megy analitikába**: név, telefonszám, kitöltött adatlapmező, a WhatsApp-üzenet szövege, a kalkulált ajánlat tételei egyik eseményben sem szerepelnek (az események csak nevet hordoznak; erre automatizált teszt van: `tests/test-resources.mjs`, `tools/test-calculator.mjs`).
- A tényleges consent-/süti-kezelés, a Google Ads és a GA4 külön, jogszerűen megvalósított munkacsomag. Ebben a csomagban nem vezettem be új cookie-bannert vagy mérési korlátozást.
