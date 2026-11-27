# CONVERSION-MEASUREMENT — konverzió, CTA-intenzitás, mérés

A mérési infrastruktúra **védett** (ADS-PROTECTION). Itt a jelenlegi állapot, a CTA-szabályok és a későbbi mérési terv.

## 1. Jelenlegi állapot [kód][élő]
- `data-page` az `<body>`-n (home, prices…), `data-cta` a CTA-linkeken (`hero`, `navigation`, `content`, `service`, `process`, `contact`, `calculator`).
- `main.js`: `whatsapp_click` (link `wa.me`), `phone_click` (link `tel:`), csak ha van consent és konfigurált azonosító; Ads-konverzióként `send_to AW-…/label`; Consent Mode v2 alapértelmezett „denied”; `ads_data_redaction`; `allow_ad_personalization_signals:false`; consent-sáv csak akkor jelenik meg, ha van azonosító.
- **`measurement-config.js` üres** (élőben is): se GA4, se Ads-címke nem tölt be a kód szerint (A-H1). Az Ads-konverzió forrása ismeretlen (OWNER-INPUT #5).

## 2. CTA-intenzitás oldaltípus szerint
| Oldaltípus | Elsődleges CTA | Intenzitás | Mobil sticky |
|---|---|---|---|
| Lokális landing (T-A), szolgáltatás (T-B) | WhatsApp, másodlagos telefon | erős: hero + közepe + záró | igen (ha jóváhagyott, #32) |
| Tranzakciós/árak (védett) | – | érintetlen | – |
| B2B (T-E) | WhatsApp B2B-sablon | közepes–erős | nem |
| Szakmai cikk (T-C) | „kérdésed van?” link/gomb | **visszafogott**: 1 doboz a cikk végén + 1 kontextuális link | nem |
| Atlasz (T-G), identificador (T-I) | „azonosítsuk együtt” (WhatsApp, fotóküldés) | közepes | nem |
| GYIK, hub | közepes | – | nem |
Szabály: **nincs hamis sürgetés, fiktív rendelkezésre állás, megalapozatlan eredménygarancia**; a „hoy” ígéret csak valós kapacitás és LGL-01 után.

## 3. Mérési terv (új oldalak)
- **Ugyanazok a `data-cta` + `data-page` konvenciók**; az új `page_type` értékek: `service`, `local`, `article`, `about`, `b2b`, `atlas`, `tool`, `hub`, `resources`, `case`. Új esemény csak jóváhagyással (D-009).
- **Ads vs organikus külön:** GA4 csatorna (Organic Search / Paid Search), `gclid`/UTM (a Google Ads auto-tagging), GSC organikus lekérdezések; a konverziók *landing page + csatorna* szerint bontva.
- **Mikro vs. valódi eredmény:** mikro = WhatsApp-/telefonkattintás, azonosító-eszköz befejezése, PDF-letöltés, atlasz-kattintás; **valós** = tényleges megkeresés (üzenet/hívás érkezett) → időpontfoglalás → megrendelés/bevétel. **A WhatsApp-kattintás nem megrendelés.**
- **Eredmény-rögzítés:** tulajdonosi napló (CSV/űrlap): dátum, csatorna-tipp („Google/Maps/Ads”), település, típus, foglalás igen/nem — havi összevetés a kattintásokkal. Az AI-diszpécser naplója (ha exportálható) a hívásokhoz.
- **Hozzájárulás:** a mérés csak a meglévő consent-logikán át (EN szöveg: „More information (Spanish)” — az EN jogi hivatkozás ES-oldalra mutat; javaslat: EN összefoglaló, jóváhagyással).

## 4. KPI-lista (nem célérték-ígéret)
Organikus megjelenés, kattintás, átlagpozíció, CTR · indexelt oldalak, indexelési problémák · márkás/nem márkás/lokális/ES/EN lekérdezések · organikus landing-teljesítmény · telefon- és WhatsApp-kattintás · tényleges megkeresés · tényleges foglalás · B2B-érdeklődés.

## 5. Későbbi integrációk (vizsgálandó)
GSC API → CSV riport (havi) · GA4 Data API · Ads (olvasás) · adminisztrációs rendszer: esetek/konverziók **piszkozat/riport** szintű összekötése, publikálás nélkül. Mindegyik tulajdonosi hozzáféréssel és adatvédelmi egyeztetéssel (LGL-03).

## Állapot-dokumentálás és integrációs előkészítés (P0.1, 2026-11-27)
**Jelenlegi konfiguráció (kód és éles egyezik):** `js/measurement-config.js` → `ga4Id: ''`, `adsId: ''`, `whatsappLabel: ''`, `phoneLabel: ''`. Következmény: a `main.js` **nem tölt be Google-címkét és nem jelenít meg consent-sávot**. Fiktív azonosítót nem hoztunk létre (a `tests/test-ads-protection.mjs` ezt ellenőrzi). Hogy az Ads-konverzió jelenleg honnan jön (hívás-asset, külön címke, importált GA4), a repóból **nem állapítható meg** → OWNER-INPUT #5.
**Az új oldalak mérésre készek:** ugyanazt a `/js/main.js?v=7` modult töltik be, `<body data-page="…">` és `data-cta` attribútumokkal (a validátor hibát jelez, ha egy `tel:`/`wa.me` link `data-cta` nélkül marad). Amint a tulajdonos kitölti a konfigot, **minden oldalon** (régi és új) egyszerre indul a mérés.
**Bekapcsolás lépései (tulajdonosi jóváhagyás + külön csomag):** 1) GA4 mérési azonosító (`G-…`) és/vagy Ads azonosító (`AW-…`) + konverziós címkék megadása a `measurement-config.js`-ben; 2) jogi felülvizsgálat (süti-/adatvédelmi oldal `[PENDIENTE]` leltár kitöltése, EN tájékoztató); 3) Consent Mode viselkedés ellenőrzése DevTools Networkben (elutasítás: nincs kérés; elfogadás: `whatsapp_click`/`phone_click`); 4) Ads-regressziós teszt újrabaseline-olása (`node tests/test-ads-protection.mjs --update`, csak jóváhagyással); 5) GA4-ben a `page_type` és `cta_position` egyedi dimenzióvá regisztrálása; 6) organikus/fizetett bontás (Ads auto-tagging + GA4 csatorna).
