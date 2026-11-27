# DECISION-LOG

Státusz: `Proposed` = javaslat tulajdonosi jóváhagyásra · `Decided` = a mestertervből adott / már eldőlt.

| ID | Dátum | Döntés | Indok | Státusz |
|---|---|---|---|---|
| D-001 | 2026-11-27 | A 6 meglévő indexelhető URL és a jogi oldalak **nem változnak**; a `/precios/` és `/apartamentos-turisticos/` terv helyett a meglévő `/precios.html` és `/chinches-apartamentos-turisticos/` marad. | Ads-védelem (mesterterv §4). | Decided |
| D-002 | 2026-11-27 | Nincs keretrendszer-váltás, nincs WordPress. Statikus HTML, build-time generálás egy kis Node-szkripttel (`tools/`, külső futásidejű függőség nélkül). | Mesterterv §25; a jelenlegi oldal is statikus. | Proposed |
| D-003 | 2026-11-27 | `/metodologia/` nem külön oldal: a módszertan = `/servicios/control-integrado/`. | Azonos szándék, duplikáció tilos. | Proposed |
| D-004 | 2026-11-27 | Preview-környezet kell; jelölt: statikus preview-host (pl. Cloudflare Pages / Netlify) jelszóval vagy noindex + `X-Robots-Tag`; **az éles deploy továbbra is kézi/jóváhagyott**. A hosting-választás tulajdonosi döntés. | A repóban nincs preview/staging. | Proposed |
| D-005 | 2026-11-27 | A generált HTML a repóban kerül commitolásra (átlátható diff, cPanel-feltöltés kompatibilis); forrás: `data/` + `content/`; `docs/`, `tools/`, `tests/` **nem** kerül élesre (deploy-kizárás). | Jelenlegi deploy-módszer ismeretlen, egyszerű feltöltés a legvalószínűbb. | Proposed |
| D-006 | 2026-11-27 | Új oldalak saját CSS-fájlt kapnak (`assets/seo.css`, `.sx-` előtagú osztályok), a `site.css`-hez nem nyúlunk. A tokenek (szín, betű) az arculatot követik. | ADS-PROTECTION. | Proposed |
| D-007 | 2026-11-27 | Településoldal (`/zonas/<város>/`) csak owner-igazolt kiszolgálási területre, valós hely-specifikus tartalommal; LocalBusiness-jelölés és „helyi” állítás nincs, amíg címet/GBP-t nem igazolt a tulajdonos. | Mesterterv §7.3, §27, §31. | Decided |
| D-008 | 2026-11-27 | A főoldali lábléc új hub-linkjei külön jóváhagyás tárgya (a főoldal módosítása). Addig az új oldalak a saját hubjaikból és a sitemapból érhetők el. | Ads-védelem. | Proposed |
| D-009 | 2026-11-27 | A hirdetési konverziómérés (`measurement-config.js`, `main.js` tracking, `data-cta`) érintetlen; az új oldalak ugyanazt a `data-cta` / `data-page` konvenciót használják, új esemény csak jóváhagyással. | CONVERSION-MEASUREMENT, ADS-PROTECTION. | Decided |
| D-010 | 2026-11-27 | A ES `/precios.html` ár-ellentmondás (A-C1) és a kalkulátor JS-hiba (A-C2) javítása **csak tulajdonosi döntés + külön ág + regressziós teszt** után. | Védett Ads-oldal. | Proposed |
| D-011 | 2026-11-27 | Keresési volumeneket csak Keyword Plannerből/GSC-ből/Ads-ből használunk; addig `UNVERIFIED`. | Mesterterv §6. | Decided |
| D-012 | 2026-11-27 | Képek: saját fotó az elsődleges; generált illusztráció csak jóváhagyással és „illusztráció” jelöléssel; minden meglévő képhez provenance-nyilatkozat kell (A-H3). | Mesterterv §17. | Decided |
| D-013 | 2026-11-27 | Dokumentumok nyelve: magyar (tulajdonosi olvasatra), a publikus szöveg-tervek ES/EN idézetekkel + magyar jelentéssel. | Tulajdonosi nyelv. | Decided |
| D-014 | 2026-11-27 | Terminológia: a főoldal „tratamiento químico combinado” vegyszer + ULV-t jelent; az új oldalakon a gőz + vegyszer kombinációt „tratamiento combinado vapor + químico”-nak hívjuk, és a főoldali elnevezést **nem** módosítjuk. | Névütközés a meglévő Ads-oldallal. | Proposed |
| D-015 | 2026-11-27 | `/contacto/` P1–P4-ben nem készül (CTA-k + lábléc); csak jogi azonosító/GBP-igény esetén. | Vékony oldal elkerülése. | Proposed |
| D-016 | 2026-11-27 | A tranzakciós új oldalak `Published` státusza az LGL-01 (spanyol működési feltételek) lezárásáig blokkolt; előkészítés megengedett. | Jogi megfelelés > organikus láthatóság. | Decided |
