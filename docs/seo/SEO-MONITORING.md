# SEO-MONITORING — SEO Control Center (CI + riport, nem külön alkalmazás)

Elv: egyszerű, dokumentált ellenőrzések (parancsok/CI) → **riport** (`reports/seo/YYYY-MM-DD.md`) → javaslat → tulajdonosi jóváhagyás → Preview → teszt → élesítés (tulajdonos) → eredménymérés. **A rendszer soha nem módosít éles tartalmat.**

## 1. Ellenőrzések
| Terület | Mit | Hogyan | Gyakoriság |
|---|---|---|---|
| HTTP | 4xx/5xx, redirect-láncok, soft 404 | crawler-szkript az URL-listán (sitemap + inventory) | heti |
| Linkek | törött belső link/kép, árva oldal | link-gráf export | heti (és minden build) |
| Meta | hiányzó/duplikált title, description; hossz | build-validátor | minden build |
| Canonical/hreflang | hibák, hiányzó nyelvi pár, kölcsönösség | validátor | minden build + heti |
| Sitemap/robots | eltérés a státuszkapuhoz képest; nem kívánt noindex | validátor | minden build + heti |
| Duplikáció | azonos URL-változatok, kannibalizáció (azonos elsődleges kulcsszó) | validátor + GSC lekérdezés-átfedés | havi |
| Strukturált adat | hibák, nem látható tartalom jelölése | validátor + Rich Results Test | build + havi |
| Képek | hiányzó alt, túl nagy, formátum, GPS | képvalidátor | minden build |
| Teljesítmény | Lighthouse (mobil/desktop), regresszió | Lighthouse CI | heti |
| Core Web Vitals | CrUX/GSC 75. percentilis | GSC (hozzáférés után) | havi |
| Mobil regresszió | képernyőkép-összevetés védett és új oldalakon | képernyőkép-teszt | build |
| Indexelés | Search Console lefedettségi problémák, indexelt/beküldött arány | GSC (kézi/API) | heti |
| Organikus trend | megjelenés, kattintás, CTR, pozíció (ES/EN, márkás/nem márkás, lokális) | GSC API → CSV | havi (28 és 90 nap) |
| Konverziók | organikus WhatsApp/telefon-kattintás, megkeresés, foglalás | GA4 + tulajdonosi napló | havi |
| Konkurensek | tartalmi változás (Rentokil városoldalak, új szereplők), SERP-változás | kézi + eszköz | havi/negyedéves |
| Tartalom-elavulás | `dateModified` > 12 hó; forrás-ellenőrzés lejárt | adatfájl-ellenőrzés | negyedéves |
| Szakmai források | hivatkozások működnek, tartalom nem változott | link-ellenőrzés + kézi | negyedéves |
| Ads-védelem | védett fájlok változatlanok (git diff), konzolhibák száma | regressziós teszt | minden build + heti |

## 2. Ritmus
**Heti:** technikai hibák, indexelési problémák, új keresőkifejezések, törött linkek/képek, sitemap+hreflang.
**Havi:** organikus teljesítmény (összehasonlítható 28 és 90 napos időszakok, szezonális összevetés); rangsorváltozás; alacsony CTR-ű, magas megjelenésű oldalak; **4–20. pozíció** lehetőségei; kannibalizáció; tartalmi hiányok; konkurensek; konverzió; indokolt frissítések; új oldalak tervezése; képállomány-bővítés.
Nincs napi helyezés-ingadozásra épülő döntés.

## 3. Változás-napló (minden érdemi módosításnál)
`docs/seo/CHANGELOG.md` és a riport: **kiindulási állapot · ok · várt eredmény · dátum · tényleges eredmény (28/90 nap) · további teendő**.

## 4. Eszközök (választható, egyszerű)
Node-szkriptek (`tools/`), Lighthouse CI, axe-core, Search Console (kézi/API), GA4, saját CSV-riportok. Fizetős SEO-eszköz csak tulajdonosi döntéssel (volumen-adatokhoz Keyword Planner ingyenes az Ads-fiókból).
