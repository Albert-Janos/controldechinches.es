# OWNER-APPROVALS-WP2 — tulajdonosi jóváhagyások (2. munkacsomag)

**Verzió:** 1.0 · **Dátum:** 2026-11-27 · **Forrás:** a tulajdonos által megadott részletes üzleti és szakmai egyeztetés (2. munkacsomag prompt, chat). Ez a dokumentum a vállalkozás **belső** adatforrása; **nem** helyettesíti a hatósági jogosultságot, a szakmai forrásellenőrzést vagy a publikálás előtti jogi ellenőrzést. A pontos számszerű értékek a `data/prices.json` és a `data/site.json` fájlokban vannak (egyetlen forrás) — itt nem ismételjük meg őket kézzel karbantartott másolatként.

## 1. Működési modell
- A munkát a tulajdonos **személyesen** végzi (nincs nagy létszámú cég, országos hálózat, városonkénti csapat, fizikai iroda). Márkahang: egységes, a bemutatkozásban egyes szám első személy.
- Specializáció: kizárólag ágyi poloska. Módszerek: célzott vegyszeres, önálló szárazgőz, kombinált; indokolt esetben kiegészítő hidegködképzés vagy engedélyezett porozás. Minden módszer alkalmazhatósága egyedi döntéstől és a technológia/készítmény előírásaitól függ.
- Kombinált kezelés: indokolt összehangolás (erős fertőzöttség, több helyiség, korábbi sikertelen irtás, eltérő felületek, tartós hatás igénye); **nem** garantált egyalkalmas teljes irtás. Önálló URL nincs.
- Réslezárás: kiegészítő/megelőző intézkedés, nem irtási módszer; építési/szerelési munkát a tulajdonos nem kínál (ügyfélnek ajánlott vs. külső szakember — lásd PG-011 „Quién hace qué”).

## 2. Felderítés és üzleti feltételek
- A helyszíni felderítés a megrendelt irtás része; **önálló, külön foglalható felderítés/kiszállás nincs**. WhatsApp-fotós előzetes azonosítás díjmentes. Lakossági ügyfél szóbeli tájékoztatást kap (nem helyettesíti a jogszabály által esetleg előírt dokumentációt). Nem minden esetben készül rendszeres fényképes dokumentáció.
- Eszközök: erős kézi lámpa, fejlámpa, nagyító, ellenőrző tükör, kéziszerszámok az ágy részleges szétszereléséhez, monitorozó csapdák.
- Utókövetés: WhatsApp-bejelentés és fényképes ellenőrzés; szükség esetén helyszíni utóellenőrzés (díj: egyedi megállapodás); monitorozó csapdák indokolt esetben. Ismételt vegyszeres kezelés javasolt időpontja általában 10–14 nap, **nem kötelező fix szabály**; ára az első kezelés megfelelő ára; nincs automatikus ingyenes második kezelés; nincs fix garanciális csomag; **nincs** jóváhagyott 30/60/90 napos fertőzésmentességi vállalás.

## 3. Árak és üzleti szabályok (nettó) → `data/prices.json`
Vegyszeres kezelés alkalmanként: 1/2/3/4 hálószoba 139/179/219/259 €, minden további +40 €. Önálló szárazgőz 150 €-tól. Vegyszeres kezelés kiegészítése szárazgőzzel +80 € (**egy összegben, nem hálószobánként**); kanapé +40 €; kiegészítő hidegködképzés 50 €-tól. Ismételt vegyszeres kezelés = az első ára; kiszállás távolságfüggő; hétvégi és sürgős kezelés normál ár, **nincs felár**; rendelkezésre állás kapacitásfüggő (aznapi időpont nem garantált); külön helyszíni utóellenőrzés egyedi megállapodás; több ingatlanos céges ügyfél egyedi árajánlat.
- **IVA:** a belső forrás nettó. A lakossági oldalon a fogyasztóvédelmi előírásoknak megfelelő, adót tartalmazó ár jelenik meg (a generátor számolja: nettó × (1 + IVA), centre pontosan, `templates/prices.mjs`); céges ajánlatban a nettó és az IVA külön is feltüntethető, ha jogszerű. A 21 % **tervezési feltételezés** (`vat.status = planning-assumption`), nem végleges adózási döntés. Amíg nem `approved`, a production build **megtagad** minden árat mutató oldalt, és a validátor „P” hibát jelez. Nyitott: alkalmazandó adókulcs, fogyasztói ármegjelenítés, könyvelői jóváhagyás.
- **Szinkron szükséges (nem módosítottuk):** az élő oldal/kalkulátor (`js/prices.js`, régi „addons”: gőz +80 **hálószobánként**), a központi árforrás és az élő diszpécser árkezelése.
- Nincs jóváhagyott: kilométerdíj, kiindulási település, távolsági zónarendszer.

## 4. Szolgáltatási terület → `data/site.json` (`serviceAreas`)
18 jóváhagyott település: Alicante, San Vicente del Raspeig, San Juan de Alicante, El Campello, Mutxamel, Elche, Santa Pola, Guardamar del Segura, Torrevieja, Orihuela Costa, Benidorm, Villajoyosa, Finestrat, Alfaz del Pi, Altea, Calpe, La Nucía, Jávea. **Dénia nincs benne.** A lábléc rövid „kiemelt” listát használ (jelezve, hogy van több), a strukturált adat és a /zonas/ oldal a teljes listát. A kiszállás kiindulási települése nincs véglegesítve. Városi aloldal továbbra is csak Alicante, Benidorm, Torrevieja (egyedi keresési szándékkal; helyi statisztika/referencia nélkül). Az élő főoldal 15 települést, az élő JSON-LD 3-at listáz → szinkron szükséges (nem módosítottuk).

## 5. Kapcsolat → `data/site.json` (`dispatcher`, `whatsapp`)
- WhatsApp (elsődleges CTA): +34 605 259 206, `https://wa.me/34605259206`, **előre kitöltött üzenet nélkül**.
- AI-diszpécser (másodlagos CTA, hívás): +34 865 699 969, `tel:+34865699969`; **spanyol nyelvű**. Angol/magyar telefonos kiszolgálás **nem igazolt**, nem állítjuk; angol kapcsolat WhatsAppon. A két szám külön adatmező, nincs felcserélve (teszt: `tests/test-content-consistency.mjs`). A weboldal ES/EN marad; magyar változat nincs. Az AI-használat átlátható (`assistantNote`). Az élő Retell/Twilio rendszer és a védett oldalak érintetlenek.

## 6. Személy (PG-016) → `data/site.json` (`person`)
Név: Albert János. Kártevőirtási tevékenység kezdete: **2023**. Magyar egészségügyi kártevőirtó szakképesítés megszerzése: **2026** (külön kezelve; nem „2023 óta”). Magyarországi szakmai tapasztalat; ágyi poloskára szakosodás; integrált szemlélet; vegyszeres + szárazgőzös technológia; személyesen végzett kezelések; folyamatos továbbképzés; saját fotók; a tudásközpont szerzője; személyes felelősség. **A magyar működési nyilvántartási szám nem publikálható** (sem látható szövegben, sem strukturált adatban). Elvégzett kezelések száma nincs megadva (nem találunk ki számot). Nincs spanyol jogosultság-állítás; a magyar végzettség nem sugall spanyol egyenértékűséget. Nemzetközi tanúsítványok listája és dokumentumai még nincsenek meg. Külső szakmai lektor **nincs** (nem találunk ki). A szerző és a lektor szerepe külön.

## 7. Célcsoport (B2B)
Turisztikai apartmanok, Airbnb-lakások, szálláshely-kezelők, több ingatlanos ügyfelek. Nagy szállodák, hostelek, panziók, teljes apartmanházak önálló célcsoportként **nincsenek jóváhagyva**. Szolgáltatások: eseti irtás, sürgős kiszállás (kapacitásfüggő), diszkréció, szomszédos helyiségek ellenőrzése, megelőző felderítés (egyedi gyakoriság), monitorozó csapdák, személyzeti oktatás, megelőzési protokoll, írásos kezelési dokumentáció és ajánlások. **Nincs** fix havi/negyedéves előfizetés, állandó szerződés vagy garantált rendszeres kiszállás. A védett apartmanos Ads-landing érintetlen.

## 8. Fotók (még nem átadottak) — lásd PHOTO-SHOT-LIST „H”
Vállalt: portrék (álló/fekvő), munka közbeni fotó, bizonyítvány, nemzetközi tanúsítványok; Polti teljes készülék és kezelőfej; matrac-/ágykeret-/kárpit-gőzölés; matrac és ágykeret átvizsgálása; célzott vegyszeres kezelés; permetező; hidegködképző (végleges kiválasztás után); fotóatlasz (felnőtt, peték, nimfák, vedlések, ürülék, matrac-/ágykeretbeli poloskák, erős fertőzöttség, búvóhelyek); anonimizált esettanulmányok hozzájárulással. **Nem vállalt:** saját városfotók (Alicante, Benidorm, Torrevieja), külön monitorozócsapda-sorozat, külön védőfelszerelés-sorozat → opcionális javaslat (`OPT`), a városi oldalak nem függnek tőlük.

## 9. Továbbra is függő (publikálást blokkoló)
Lásd OWNER-INPUT-REQUIRED „Állapot a 2. munkacsomag után” és „13. Új nyitott tételek”.
