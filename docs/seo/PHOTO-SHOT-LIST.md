# PHOTO-SHOT-LIST — tulajdonosi fotózási feladatlista

Közvetlenül használható. Minden sor: **kép-ID · mit kell lefényképezni · mi látszódjon · mit kerülj**. A teljes ES/EN alt/felirat és a pontos oldal-hozzárendelés a `IMAGE-ASSET-INVENTORY.csv` és a `PAGE-IMAGE-MAP.csv` ID alapján.

## A. Általános szabályok (mindenhez)
1. **Telefon is jó**, ha a fő kamerával, 1×-es zoommal, jó fényben fotózol. Nincs digitális zoom, nincs „szépítő” mód, nincs AI-szűrő.
2. **Fekvő** állásban, **legalább 2400 px hosszú oldal** (a telefon eredeti fájlja megfelel). A **nyers eredetit** mentsd el; ne küldd át üzenetküldőn (tömörít) — pendrive/Drive/e-mail eredeti méretben.
3. Fény: természetes oldalfény vagy diffúz lámpa; **nincs vaku** a matrac-/makrófotón (tükröződés). Fókusz a témára koppintva, expozíció korrigálva.
4. **Személyes adat ne látszódjon:** ügyfél címe, neve, arca, ajtószám, rendszám, tévé-/telefonképernyő. Munkahelyi fotónál kérj **írásos hozzájárulást**.
5. Csak **valós munkát** fotózz valós munkaként. Ha bemutató (saját matrac/próbabútor), jelöld a fájl nevében: `DEMO_`.
6. Fájlnév: `<kép-ID>_<dátum>_<hely>.jpg` (pl. `IMG-DRY-04_2026-12-03_alicante.jpg`); a helyet (város) mindig rögzítsd — **más településen készült kép nem lehet helyi referencia**.
7. Kapcsold ki a **helymeghatározást** a kamerán (vagy hagyd; a pipeline törli, de a nyers archívum maradjon nem nyilvános).
8. Minden fotóhoz egy rövid jegyzet: dátum, hely, mit látunk, a gép típusa/beállítása.

## B. P0 — 9 fotó, ezekkel indulj

| ID | Konkrét feladat |
|---|---|
| **IMG-ABOUT-01** | **Fekvő portré** munkaruhában (a szokásos védőruha/póló, logó nélkül ha nincs), természetes fényben, lakásbelsőben vagy kezelés előtt; a tekintet a kamerába; derékig vagy mellkasig; legalább 2400 px szélesség; háttér: rendezett szoba. Kerüld: napszemüveg, erős ellenfény, szűrő. |
| **IMG-ABOUT-02** | **Álló portré** ugyanabban a ruhában, mellkasig, semleges háttér; az arc legyen a kép felső harmadában (négyzetes kivágáshoz is jó). |
| **IMG-ABOUT-05** | A **gőzgép teljes képe** (a ténylegesen használt gép — ha Polti Cimex Eradicator, a típusfelirat legyen olvasható), semleges padlón/falnál, oldalról, a tömlővel és a kezelőfejjel együtt; fekvő, ≥ 2400 px. |
| **IMG-CRED-01** | Az **egészségügyi kártevőirtó bizonyítvány** szkennelve (300 dpi) vagy egyenesen fotózva, árnyék nélkül; **ne takard ki te** (a kitakarást mi csináljuk irreverzibilisen); jelezd, mely adatok nem publikálhatók. |
| **IMG-DRY-01** | A gőzgép **teljes gépfotó** működésre kész állapotban a lakásban/garázsban; a kezelőfej és a tömlő látszik. (Ha azonos az ABOUT-05-tel, egy jó kép elég — jelezd.) |
| **IMG-DRY-03** | **A kezelőfej közeli fotója**: a fúvóka a kezedben, látható gőzzel; közelről (10–20 cm), fekvő, ≥ 2400 px. |
| **IMG-DRY-04** | **Fekvő, legalább 2400 px széles saját fotó, amelyen a gép kezelőfejével egy matracvarrás tényleges kezelése látható**: a fúvóka a matrac szegélyvarrásán (piping), a gőz látható, a matrac szövete jól látszik. Háttérben nincs ügyfél-azonosító adat. |
| **IMG-INS-01** | **Matracvarrás ellenőrzése lámpával**: zseblámpa/fejlámpa fénye a varráson, a kéz és a lámpa látszik; közel (30–40 cm), fekvő, élesen. Ha nincs ügyfél, saját matracon `DEMO_`-ként. |
| **IMG-IPM-01** | **Hero a módszertan oldalra**: te dolgozol egy hálószobában (felderítés vagy kezelés közben), a kép egészen mutassa a környezetet és a munkamódszert; fekvő, ≥ 2400 px; arc nem kötelező. |

## C. P1 — következő kör (48 fotó) — csoportonként

**Szárazgőz (`IMG-DRY-02, 05–10`):** a kezelőpanel/manométer közelije (02) · somier/ágykeret illesztései (05) · fejtámla hátoldala és illesztései (06) · bútorillesztés/fiókvezető (07) · kárpitozott kanapé varrásai (08) · egész szoba szélesen a kezelés közben (09) · **te kezelés közben hero-ként** (10).
**Vegyszeres (`IMG-CHEM-01…06`):** a *ténylegesen használt* permetezők/lándzsa/hátpermetező kirakva (01–02) · védőfelszerelés viselve vagy kirakva (03) · célzott kezelés a matrac szélén (04) · ágykeret (05) · szegélyléc/rodapié (06). **Terméknevek/címke nem fontos a képen**; ha látszik, a termék spanyolországi engedélyezettségét igazolni kell (LGL-05).
**Felderítés (`IMG-INS-02…06`):** ágykeret illesztések (02) · csavarfuratok (03) · fejtámla mögött (04) · kanapévarrások/alsó rész (05) · fertőzöttség dokumentálása — telefon/jegyzet a kézben (06).
**IPM (`IMG-IPM-02…06`):** búvóhely-azonosítás szobaképen (02) · egyedi kezelési terv papíron/tableten (03; ügyféladat nélkül) · monitoring eszköz az ágy lába alatt (04) · utóellenőrzési látogatás (05) · **szerkezeti rés/repedés makróban skálával** (06) + `IMG-IPM-SEAL-01` falrepedés, `-02` szegélylécmögötti rés.
**Makró (`IMG-ENT-…`):** felnőtt nőstény táplált (`ADU-01`), hím (`ADU-02`), éhes egyed (`ADU-03`), pete (`EGG-01`), első nimfa (`NYM-01`), vedlés varratban (`MOU-01`), ürülék a matracvarrásban (`EXC-01`), búvóhely: matrac (`HID-01`) és ágykeret (`HID-02`), egy egyed vonalzóval (`SCALE-01`). Eszköz: makró üzemmód/clip-on makrólencse, **vonalzó (mm) vagy érme a képen belül**, stabil támasz, fekvő, ≥ 2400 px; a fajt/stádiumot **nem te és nem AI határozod meg**, a leírásba csak amit tudsz („kb. 1. nimfa”), az ellenőrzést szakember végzi.
**Helyi (`IMG-LOC-ALC-01, BEN-01, TOR-01, LOC-00`):** saját városkép Alicanteról, Benidormról, Torreviejáról (fekvő, ≥ 2400 px, ismert helyen); a térképet mi rajzoljuk.

## D. P2 és P3
Lásd inventory (`priority = P2/P3`): további makrók (`ADU-04/05, EGG-02, NYM-02…05, MOU-02, EXC-02, HID-03…06, SCALE-02`), B2B (`IMG-B2B-01…05`), megelőzés/előkészítés (`PREV`, `PREP`), további okmányok (`CRED-02…06`), helyi munkák (csak ha valóban ott dolgoztál).

## E. Amit NE készíts / ne küldj
Idegen cégek fotóit; internetről letöltött képet; AI-val generált/módosított „munkafotót”; ügyfélcímet; arcot; más településen készült munkát helyi képként.

## F. Átadás és visszajelzés
Tölts fel mappánként (`P0/`, `P1/…`); a `FOTO_JEGYZET.csv`-ben (azonosító, dátum, hely, megjegyzés, hozzájárulás van/nincs) rögzítsd az adatokat. A jegyzet nélküli kép nem kerül be.

## G. Képhasználati pontosítás (1. javítási csomag)
A hero- és a törzsbeli kép külön képazonosító (új azonosító nem kellett: a PAGE-IMAGE-MAP-ben már tervezett eszközöket használjuk): **PG-012** törzs: `IMG-INS-02` (somier illesztései), hero: `IMG-INS-01` · **PG-014** törzs: `IMG-CHEM-05` (somier kezelése), hero: `IMG-CHEM-04` · **PG-041** törzs: `IMG-ENT-EXC-01` (ürülék a varratban), hero: `IMG-INS-01` · **PG-047** csak hero (`IMG-PREV-01`). Az **IMG-INS-02, IMG-CHEM-05 és IMG-ENT-EXC-01 P1 fotókra** ezért ezeken az oldalakon is szükség van. A makrók kivágás nélkül jelennek meg, az álló portré (`IMG-ABOUT-02`) kompakt (kb. 300 px) méretben kerül az oldalra.

## H. Véglegesített fotólista (2. munkacsomag, 2026-11-27)
A tulajdonos ezeket **vállalta**, de még **nem adta át**; a helyőrzők fejlesztői állapotban maradnak. A meglévő azonosítókat használjuk, új azonosító nem készült.
| Csoport | Azonosítók | Megjegyzés |
|---|---|---|
| Bemutatkozás | `IMG-ABOUT-02` (álló portré, munkaruha), `IMG-ABOUT-01` (fekvő portré), `IMG-ABOUT-07`/`-04` (munka közben) | portré kompakt méretben (~300 px) kerül az oldalra |
| Okmányok | `IMG-CRED-01` (szakképesítés), `IMG-CRED-04`…`-06` (nemzetközi tanúsítványok) | személyes adatokat publikálás előtt visszafordíthatatlanul takarni; a lista még nincs meg |
| Gép és gőzölés | `IMG-DRY-01` (Polti Cimex Eradicator teljes), `IMG-DRY-03` (kezelőfej közelről), `IMG-DRY-04` (matracvarrat), `IMG-DRY-05` (ágykeret), `IMG-DRY-08` (kárpitozott bútor), `IMG-DRY-10` (hero) | |
| Felderítés | `IMG-INS-01` (matrac átvizsgálása lámpával), `IMG-INS-02` (ágykeret, búvóhelyek), `IMG-INS-06` (erős fertőzöttség dokumentálása) | |
| Vegyszeres | `IMG-CHEM-04` (célzott kezelés), `IMG-CHEM-02` (permetező), `IMG-CHEM-05` (ágykeret), `IMG-CHEM-01` (hidegködképző — **a végleges kiválasztás után**) | konkrét típus/műszaki adat nem jelenhet meg jóváhagyottként |
| Fotóatlasz | `IMG-ENT-ADU-*`, `-EGG-*`, `-NYM-*`, `-MOU-*`, `-EXC-*`, `-HID-*` (matrac, ágykeret, búvóhelyek), `-SCALE-*` | makró: méretarány (vonalzó), torzítás/kivágás nélkül; faj/stádium nem AI-meghatározás |
| Referenciák | valós, anonimizált esettanulmány-fotók | csak hozzájárulással; PG-073 üres marad |
**Nem vállalt (opcionális javaslat, `OPT` az inventoryban):** saját városfotók (`IMG-LOC-*`: Alicante, Benidorm, Torrevieja), külön monitorozócsapda-sorozat (`IMG-IPM-04`, `IMG-IPM-MON-*`), külön védőfelszerelés-sorozat (`IMG-CHEM-03`). A városi oldalak ezek nélkül, szöveges herón működnek. Szabályok: nincs AI-generált esettanulmány-fotó, nincs stockfotó saját munkaként, a fotók eredete és felhasználási joga dokumentálandó.
