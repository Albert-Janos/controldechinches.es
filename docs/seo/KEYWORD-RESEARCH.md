# KEYWORD-RESEARCH — P0 (2026-11-27)

## Státusz és korlát
- **Keresési volumen: NINCS hiteles adat.** Nincs hozzáférésem Google Keyword Plannerhez, GSC-hez, Ads-hez, Ahrefs/Semrushhoz. A klaszterek **szándék- és SERP-megfigyelés** alapján állnak (2026-11-27, nyilvános webes keresés, US-szerver, nem ES-lokalizált). Minden volumen- és nehézségi adat: **ELLENŐRIZENDŐ**.
- Következő lépés a tulajdonosnak: `KEYWORD-PLANNER-IMPORT.csv` feltöltése Google Keyword Plannerbe. Beállítás: **Ország: Spanyolország; Nyelv: spanyol (ES-lista), angol (EN-lista)**; helyszín: Alicante tartomány / Costa Blanca városai; időszak: utolsó 12 hónap (szezonalitás). Az eredmény → `KEYWORD-URL-MAP.csv` `volume_*` oszlopai.
- Az Ads keresésiszó-riport (search terms) a legértékesebb valós adat — kérjük a tulajdonostól exportként (OWNER-INPUT).

## Klaszterek szándék szerint (részlet: `KEYWORD-URL-MAP.csv`)

| ID | Klaszter | Szándék | Elsődleges URL (jelenlegi/terv) |
|---|---|---|---|
| K01 | tratamiento/eliminar chinches de cama + Alicante | tranzakciós, lokális | `/` (védett Ads-landing) |
| K02 | precio tratamiento chinches | tranzakciós/ár | `/precios.html` |
| K03 | chinches apartamento turístico / alquiler vacacional | B2B tranzakciós | `/chinches-apartamentos-turisticos/` |
| K04 | + város: Benidorm, Torrevieja, Elche, Calpe, Orihuela Costa, Altea | lokális tranzakciós | `/zonas/<város>/` (jogi kapu után) |
| K05 | vapor / vapor seco contra chinches | info + tranzakciós | `/servicios/vapor-seco/` + cikk |
| K06 | tratamiento químico / insecticida chinches | info + tranzakciós | `/servicios/tratamiento-quimico/` |
| K07 | control integrado de plagas chinches / GIP | információs-szakmai | `/servicios/control-integrado/` |
| K08 | cómo saber si tengo chinches / señales / manchas | információs | `/guia-chinches/como-saber-si-tengo-chinches/` |
| K09 | picaduras de chinches / chinches o pulgas | információs | `/guia-chinches/picaduras-de-chinches/` |
| K10 | dónde se esconden / colchón / sofá | információs | két külön cikk |
| K11 | cómo se contagian / viajes / hoteles | információs | 2 cikk |
| K12 | remedios caseros / mitos | információs | 1 cikk |
| K13 | por qué vuelven / cuántos tratamientos / cuánto tarda | információs | 2 cikk |
| K14 | preparar vivienda / después del tratamiento | információs | 2 cikk |
| K15 | niños y mascotas / ropa / lavado | információs | 2 cikk |
| K16 | chinches hotel / protocolo / personal limpieza | B2B információs | 3–4 cikk |
| K17 | urgente / hoy / 24 h (sürgős) | tranzakciós | **nincs külön oldal** — CTA-szöveg szintjén (jogi kapu!) |
| K18 | EN: bed bug treatment Alicante / Costa Blanca / Benidorm | EN tranzakciós | `/en/` + EN zonák |
| K19 | EN: bed bugs holiday rental / Airbnb host | EN B2B | `/en/bed-bugs-holiday-rentals/` |
| K20 | EN: how to tell if you have bed bugs / bites / bed bugs in Spain | EN info | EN guide cikkek |
| K21 | képkeresés: chinche de cama foto / huevos / ninfa / mudas | vizuális | `/atlas-chinches/` |
| K22 | azonosító eszköz „tengo chinches?” | info + eszköz | `/identificador-chinches/` |

## Kannibalizáció-szabályok
1. Egy elsődleges szándék → egy URL. A `KEYWORD-URL-MAP.csv` `primary_url` oszlopa kötelező, és a build-time validáció tiltja a duplikált elsődleges kulcsszót (SEO-QUALITY-GATE).
2. Szolgáltatásoldal (tranzakciós) ≠ tudásközpont-cikk (információs): a cikk linkel a szolgáltatásra, **nem** versenyez vele címben.
3. `/zonas/<város>/` csak helyspecifikus, valós tartalommal; a „chinches Alicante” a főoldalé (K01), a város-oldal a „… a Alicante ciudad / barris / ingatlan-típus” szándékot kapja.
4. A „precio” szó a `/precios.html`-é; más oldal ne optimalizáljon rá a title-ben.
5. EN és ES külön kulcsszótérkép (nem fordítás): EN: „bed bug treatment Costa Blanca”, „bed bugs in holiday rental Spain”, „bed bug bites”; ES: „chinches de cama”, „chinches colchón”.

## Hiányzó adatok, amelyeket be kell szerezni
Keyword Planner volumen (ES/EN), Ads search terms, GSC lekérdezések (ha van property), Google Trends szezonalitás (nyár-ősz csúcs feltételezés → **ellenőrizendő**), SERP-jellemzők (Local Pack, PAA, képblokk) ES-IP-ről, Maps-versenytársak száma városonként.
