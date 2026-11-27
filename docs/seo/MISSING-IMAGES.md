# MISSING-IMAGES — hiányzó és cserélendő képek (automatikusan generált)

Generálva: `node tools/build-missing-images-doc.mjs` (a jelenlegi oldaladatokból és képmanifestből). Frissíteni kell minden képátadás után.
Szabályok: nem használunk stockfotót, és nem generálunk képet; a fotókat a tulajdonos adja. Fényképet **csak** a „Saját fotó” sorokhoz kell biztosítani.

## A. Üres képhelyek az oldalakon (18 kötelező, 27 opcionális)
**KÖTELEZŐ** = P0/P1: a publikálást blokkolja (a production build megtagadja). **Opcionális** = P2/P3: a production build **kihagyja** a hiányzó képet, az oldal nem blokkolt; előnézetben placeholder látszik. Ebből 18 kötelező kép fotó/dokumentum, a többi infografika (SVG) lenne, de azok mind opcionálisak.

| Oldal neve | Szekció | Hiányzó képek száma | Pontosan milyen képre van szükség | Tájolás és képarány | Saját vagy generált kép | Prioritás |
|---|---|---|---|---|---|---|
| PG-013 · Tratamiento de chinches con vapor seco (`/servicios/vapor-seco/`) | Cómo funciona el método | 1 | **IMG-DRY-04**: Szárazgőzös kezelés egy matracvarraton: a fúvóka a matrac szegélyvarrásán, a gőz látható, a matrac szövete jól látszik; a háttérben nincs ügyfél-azonosító adat. | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | Oldal teteje (hero) | 1 | **IMG-ABOUT-01**: Fekvő portré munkaruhában (derékig/mellkasig), természetes fényben, rendezett háttérrel, a tekintet a kamerába; legalább 2400 px széles. | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | Formación y documentos | 3 | **IMG-CRED-01**: Az egészségügyi kártevőirtó (magyar) szakképesítést igazoló bizonyítvány szkennelve (300 dpi) vagy egyenesen fotózva, kitakarás nélkül (a kitakarást mi végezzük, visszafordíthatatlanul).<br>**IMG-CRED-02**: Szakmai nyilvántartási igazolás — a tulajdonos döntése szerint a nyilvántartási szám nem publikálható, ezért ez a kép valószínűleg elhagyható.<br>**IMG-CRED-03**: További képzést igazoló oklevél/bizonyítvány (cím, kiállító, év olvasható). | fekvő 4:3 (dokumentum) | Saját dokumentum (szkennelve/fotózva) | KÖTELEZŐ |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | Certificados y cursos | 1 | **IMG-CRED-04**: További tanúsítvány vagy kurzusigazolás (téma és kiállító olvasható). | fekvő 4:3 (dokumentum) | Saját dokumentum (szkennelve/fotózva) | KÖTELEZŐ |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | Especialización en chinches de cama | 1 | **IMG-ABOUT-04**: Munka közben: a matracvarrat átvizsgálása lámpával (arc nem kötelező). | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | En el trabajo | 2 | **IMG-ABOUT-08**: A felderítési megállapítások dokumentálása a helyszínen (jegyzet/fotó), ügyféladat nélkül.<br>**IMG-ABOUT-09**: Az eszközök előkészítése a kezelés előtt (a ténylegesen használt felszerelés). | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | Certificados y cursos | 1 | **IMG-CRED-06**: Egyéb ellenőrizhető szakmai dokumentum. | fekvő 4:3 (dokumentum) | Saját dokumentum (szkennelve/fotózva) | Opcionális |
| PG-016 · Albert János: especialista en chinches de cama (`/sobre-mi/`) | En el trabajo | 1 | **IMG-ABOUT-10**: Természetes munkakörnyezeti hangulatkép a tulajdonosról. | fekvő 3:2 | Saját fotó (valós munka) | Opcionális |
| PG-041 · ¿Cómo saber si tengo chinches de cama? (`/guia-chinches/como-saber-si-tengo-chinches/`) | Cuidado con las confusiones | 1 | **IG-08**: A matrac és az ágykeret átvizsgálási pontjai (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-044 · ¿Dónde se esconden las chinches de cama? (`/guia-chinches/donde-se-esconden-las-chinches/`) | En infestaciones grandes | 1 | **IG-07**: Tipikus búvóhelyek egy hálószobában (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-045 · Chinches en el colchón: cómo revisarlo (`/guia-chinches/chinches-en-el-colchon/`) | Fundas protectoras | 1 | **IG-08**: A matrac és az ágykeret átvizsgálási pontjai (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-047 · ¿Cómo se contagian las chinches de cama? (`/guia-chinches/como-se-contagian-las-chinches/`) | Oldal teteje (hero) | 1 | **IMG-PREV-01**: Poggyász átvizsgálása utazás után (bőrönd varratai, lámpával). | fekvő 3:2 | Saját fotó (valós munka) | Opcionális |
| PG-047 · ¿Cómo se contagian las chinches de cama? (`/guia-chinches/como-se-contagian-las-chinches/`) | Entre viviendas y alojamientos | 1 | **IG-09**: A poloskák behurcolásának útjai (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-048 · Chinches en viajes y hoteles (`/guia-chinches/chinches-viajes-y-hoteles/`) | Al volver a casa | 1 | **IG-09**: A poloskák behurcolásának útjai (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-049 · Cómo eliminar las chinches de cama (`/guia-chinches/como-eliminar-chinches-de-cama/`) | Un enfoque integrado | 1 | **IG-14**: Kezelési technológiák összehasonlítása (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-050 · ¿El vapor mata las chinches de cama? (`/guia-chinches/vapor-contra-chinches/`) | Oldal teteje (hero) | 1 | **IMG-DRY-04**: Szárazgőzös kezelés egy matracvarraton: a fúvóka a matrac szegélyvarrásán, a gőz látható, a matrac szövete jól látszik; a háttérben nincs ügyfél-azonosító adat. | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-050 · ¿El vapor mata las chinches de cama? (`/guia-chinches/vapor-contra-chinches/`) | Un estudio de laboratorio | 1 | **IG-14**: Kezelési technológiák összehasonlítása (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-052 · Resistencia a insecticidas en chinches (`/guia-chinches/resistencia-insecticidas-chinches/`) | Qué dice la literatura científica | 1 | **IG-14**: Kezelési technológiák összehasonlítása (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-053 · ¿Por qué vuelven las chinches? (`/guia-chinches/por-que-vuelven-las-chinches/`) | Oldal teteje (hero) | 1 | **IMG-IPM-05**: Utóellenőrzés a kezelés után (az ágy/monitor ellenőrzése a helyszínen). | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-055 · Cómo preparar la vivienda para el tratamiento (`/guia-chinches/preparar-vivienda-tratamiento-chinches/`) | Oldal teteje (hero) | 1 | **IMG-PREP-01**: A kezelésre előkészített hálószoba (ágynemű zárt zsákokban, hozzáférhető ágykörnyezet). | fekvő 3:2 | Saját fotó (valós munka) | Opcionális |
| PG-056 · Qué hacer después del tratamiento de chinches (`/guia-chinches/despues-del-tratamiento-chinches/`) | Oldal teteje (hero) | 1 | **IMG-PREP-02**: Kezelés utáni szellőztetés: nyitott ablak a kezelt szobában. | fekvő 3:2 | Saját fotó (valós munka) | Opcionális |
| PG-058 · Ropa y textiles con chinches (`/guia-chinches/ropa-y-textiles-chinches/`) | Oldal teteje (hero) | 1 | **IMG-PREP-03**: Ágynemű zárt zsákban, mosásra előkészítve. | fekvő 3:2 | Saját fotó (valós munka) | Opcionális |
| PG-059 · Sellar grietas y huecos: qué puede y qué no puede hacer (`/guia-chinches/sellar-grietas-chinches/`) | Oldal teteje (hero) | 1 | **IMG-IPM-06**: Szerkezeti rés vagy repedés, amely búvóhely lehet (közelkép, méretarány). | fekvő 3:2 | Saját fotó (valós munka) | KÖTELEZŐ |
| PG-059 · Sellar grietas y huecos: qué puede y qué no puede hacer (`/guia-chinches/sellar-grietas-chinches/`) | Qué recomiendan las fuentes | 1 | **IG-16**: Réslezárás: mit javasolnak a források (infografika). | infografika 16:9 (SVG) | Tervezett SVG-infografika (fejlesztői feladat, nem kell fényképet biztosítani) | Opcionális |
| PG-062 · Detección temprana en apartamentos turísticos (`/guia-chinches/deteccion-temprana-apartamentos/`) | Oldal teteje (hero) | 1 | **IMG-B2B-04**: A takarítószemélyzet ellenőrzőlistája használat közben (anonim, apartmanban). | fekvő 3:2 | Saját fotó (valós munka) | Opcionális |
| PG-070 · Atlas fotográfico de chinches de cama (`/atlas-chinches/`) | Atlas fotográfico | 6 | **IMG-ENT-ADU-02**: Kifejlett hím poloska dorzális nézetben, makró, vonalzóval.<br>**IMG-ENT-ADU-03**: Éhes (nem táplált) kifejlett poloska makró, vonalzóval.<br>**IMG-ENT-SCALE-01**: Egy poloska vonalzó (mm) vagy érme mellett — méretarányos azonosító kép.<br>**IMG-ENT-EGG-01**: Izolált peték makró, vonalzóval.<br>**IMG-ENT-NYM-01**: Első stádiumú nimfa makró, vonalzóval.<br>**IMG-ENT-EXC-01**: Ürüléknyomok matracvarratban (közelkép). | fekvő 3:2 | Saját makrófotó (vonalzóval) | KÖTELEZŐ |
| PG-070 · Atlas fotográfico de chinches de cama (`/atlas-chinches/`) | Atlas fotográfico | 11 | **IMG-ENT-ADU-04**: Táplált és éhes egyed egymás mellett (összehasonlítás).<br>**IMG-ENT-EGG-02**: Petecsoport illesztésben vagy varratban.<br>**IMG-ENT-NYM-02**: Második stádiumú nimfa.<br>**IMG-ENT-NYM-03**: Harmadik stádiumú nimfa.<br>**IMG-ENT-NYM-04**: Negyedik stádiumú nimfa.<br>**IMG-ENT-NYM-05**: Ötödik stádiumú nimfa.<br>**IMG-ENT-MOU-02**: Izolált levedlett kültakaró makróban.<br>**IMG-ENT-HID-03**: Poloskák bútorillesztésben.<br>**IMG-ENT-HID-04**: Poloskák a fejtámla mögött.<br>**IMG-ENT-HID-05**: Poloskák fal és szegélyléc sarkában.<br>**IMG-ENT-HID-06**: Poloskák kárpitozott kanapén. | fekvő 3:2 | Saját makrófotó (vonalzóval) | Opcionális |

## B. Már beillesztett, de nem saját helyszíni dokumentációnak minősülő képek
Ezek a képek a helyükön vannak és kiírt (illusztráció / semleges) felirattal jelennek meg; nem blokkolnak, de a hitelesség miatt saját fotóra cserélendők, ill. a jogaikat tisztázni kell.

| Oldal | Szekció | Képazonosító | Mit ábrázol a javasolt saját fotó | Státusz |
|---|---|---|---|---|
| PG-011 · Control integrado de chinches de cama (GIP) | Oldal teteje (hero) | IMG-IPM-01 | A tulajdonos dolgozik egy hálószobában (felderítés vagy kezelés közben), a környezet is látszik. | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-011 · Control integrado de chinches de cama (GIP) | Cómo se elige el método | IMG-IPM-03 | Egyedi kezelési terv/ellenőrzőlap a ténylegesen használt eszközökkel (ügyféladat nélkül). | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-012 · Inspección y diagnóstico de chinches | Oldal teteje (hero) | IMG-INS-01 | Matracvarrat átvizsgálása zseblámpával, a kéz és a lámpa látszik (30–40 cm-ről). | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-012 · Inspección y diagnóstico de chinches | Antes de ir: conversación y fotos por WhatsApp | IMG-INS-05 | Kanapévarratok / a kanapé alsó részének átvizsgálása. | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-015 · Prevención y monitorización para alojamientos | Oldal teteje (hero) | IMG-B2B-01 | Turisztikai apartman hálószobája a felderítés közben. | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-020 · Zonas de servicio en la Costa Blanca | Algunas localidades | IMG-LOC-ALC-01 | Saját városkép Alicanteról (fekvő, ≥ 2400 px, ismert helyen). | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-020 · Zonas de servicio en la Costa Blanca | Algunas localidades | IMG-LOC-BEN-01 | Saját városkép Benidormról. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-020 · Zonas de servicio en la Costa Blanca | Algunas localidades | IMG-LOC-TOR-01 | Saját városkép Torreviejáról. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-020 · Zonas de servicio en la Costa Blanca | Algunas localidades | IMG-LOC-CAL-01 | Saját városkép Calpéról. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-020 · Zonas de servicio en la Costa Blanca | Algunas localidades | IMG-LOC-ALT-01 | Saját városkép Alteáról. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-021 · Chinches de cama en Alicante | Oldal teteje (hero) | IMG-LOC-ALC-01 | Saját városkép Alicanteról (fekvő, ≥ 2400 px, ismert helyen). | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-021 · Chinches de cama en Alicante | El servicio en Alicante | IMG-LOC-ALC-02 | Egy ténylegesen kezelt vagy bemutató lakás hálószobája (ügyféladat nélkül). | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-022 · Chinches de cama en Benidorm | Oldal teteje (hero) | IMG-LOC-BEN-01 | Saját városkép Benidormról. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-022 · Chinches de cama en Benidorm | Apartamentos turísticos en Benidorm | IMG-B2B-01 | Turisztikai apartman hálószobája a felderítés közben. | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-023 · Chinches de cama en Torrevieja | Oldal teteje (hero) | IMG-LOC-TOR-01 | Saját városkép Torreviejáról. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-043 · Ciclo de vida de la chinche de cama | Oldal teteje (hero) | IMG-ENT-ADU-01 | Kifejlett poloska makró, vonalzóval/érmével a képen, fajmeghatározás szakember által. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-045 · Chinches en el colchón: cómo revisarlo | Oldal teteje (hero) | IMG-INS-01 | Matracvarrat átvizsgálása zseblámpával, a kéz és a lámpa látszik (30–40 cm-ről). | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-048 · Chinches en viajes y hoteles | Oldal teteje (hero) | IMG-PREV-02 | Az ágy ellenőrzése szálláshelyre érkezéskor. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |
| PG-049 · Cómo eliminar las chinches de cama | Oldal teteje (hero) | IMG-IPM-03 | Egyedi kezelési terv/ellenőrzőlap a ténylegesen használt eszközökkel (ügyféladat nélkül). | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-060 · Monitorización de chinches de cama | Oldal teteje (hero) | IMG-IPM-04 | Monitorozó csapda az ágy lába alatt. | Illusztráció (nem saját helyszíni dokumentáció) → saját fotóra cserélendő; addig „Ilustración” felirattal jelenik meg |
| PG-061 · Protocolo de inspección de chinches en alojamientos | Oldal teteje (hero) | IMG-B2B-02 | Szálláshely-szoba átvizsgálása. | Szerző és felhasználási jog nincs dokumentálva → jogtisztázás vagy saját kép szükséges; semleges felirattal jelenik meg |

## C. Tervezett további saját fotók (még nincs képhely az oldalon; a beérkezéskor illesztjük be)
| Oldal | Tervezett szekció | Darab | Pontosan milyen képre van szükség |
|---|---|---|---|
| PG-011 · Control integrado de chinches de cama (GIP) | author | 1 | **IMG-ABOUT-01**: Fekvő portré munkaruhában (derékig/mellkasig), természetes fényben, rendezett háttérrel, a tekintet a kamerába; legalább 2400 px széles. |
| PG-011 · Control integrado de chinches de cama (GIP) | diagnosis | 1 | **IMG-ABOUT-04**: Munka közben: a matracvarrat átvizsgálása lámpával (arc nem kötelező). |
| PG-011 · Control integrado de chinches de cama (GIP) | documentation | 1 | **IMG-ABOUT-08**: A felderítési megállapítások dokumentálása a helyszínen (jegyzet/fotó), ügyféladat nélkül. |
| PG-011 · Control integrado de chinches de cama (GIP) | follow-up | 1 | **IMG-IPM-05**: Utóellenőrzés a kezelés után (az ágy/monitor ellenőrzése a helyszínen). |
| PG-011 · Control integrado de chinches de cama (GIP) | structural | 2 | **IMG-IPM-06**: Szerkezeti rés vagy repedés, amely búvóhely lehet (közelkép, méretarány).<br>**IMG-IPM-SEAL-01**: Falrepedés az ágy mellett. |
| PG-012 · Inspección y diagnóstico de chinches | bed-frame | 2 | **IMG-INS-02**: Az ágykeret illesztéseinek átvizsgálása lámpával.<br>**IMG-INS-03**: Az ágykeret csavarfuratainak átvizsgálása. |
| PG-012 · Inspección y diagnóstico de chinches | headboard | 1 | **IMG-INS-04**: A fejtámla hátoldalának átvizsgálása. |
| PG-013 · Tratamiento de chinches con vapor seco | technology | 2 | **IMG-DRY-02**: A gép kezelőpaneljének és manométerének közelije.<br>**IMG-DRY-03**: A Polti kezelőfeje közelről (10–20 cm), kezben, látható gőzzel. |
| PG-013 · Tratamiento de chinches con vapor seco | uses | 3 | **IMG-DRY-06**: Gőzölés a fejtámlán (kárpitozott vagy fa fejtámla hátoldala és illesztései).<br>**IMG-DRY-07**: Gőzölés bútorillesztésen / fiókvezetőn.<br>**IMG-DRY-08**: Gőzölés kárpitozott kanapén vagy fotelen (varratok). |
| PG-013 · Tratamiento de chinches con vapor seco | workflow | 1 | **IMG-DRY-09**: A teljes hálószoba szélesen, a gőzös kezelés közben (munkafolyamat). |
| PG-014 · Tratamiento químico contra chinches de cama | tools | 2 | **IMG-CHEM-01**: A ténylegesen használt vegyszeres kijuttató eszközök kirakva (a hidegködképzőt a végleges típusválasztás után).<br>**IMG-CHEM-02**: Hátpermetező / lándzsa célzott kezelés közben. |
| PG-014 · Tratamiento químico contra chinches de cama | workflow | 2 | **IMG-CHEM-05**: Az ágykeret kezelése.<br>**IMG-CHEM-06**: Szegélyléc / rodapié kezelése. |
| PG-016 · Albert János: especialista en chinches de cama | path | 1 | **IMG-ABOUT-03**: Álló, egész alakos kép munkaruhában, a munkafelszereléssel. |
| PG-016 · Albert János: especialista en chinches de cama | equipment | 1 | **IMG-ABOUT-06**: A tulajdonos a kirakott, előkészített munkafelszereléssel. |
| PG-041 · ¿Cómo saber si tengo chinches de cama? | inline | 1 | **IMG-ENT-EXC-01**: Ürüléknyomok matracvarratban (közelkép). |
| PG-043 · Ciclo de vida de la chinche de cama | inline | 2 | **IMG-ENT-ADU-02**: Kifejlett hím poloska dorzális nézetben, makró, vonalzóval.<br>**IMG-ENT-ADU-03**: Éhes (nem táplált) kifejlett poloska makró, vonalzóval. |
| PG-043 · Ciclo de vida de la chinche de cama | eggs | 1 | **IMG-ENT-EGG-01**: Izolált peték makró, vonalzóval. |
| PG-043 · Ciclo de vida de la chinche de cama | nymphs | 1 | **IMG-ENT-NYM-01**: Első stádiumú nimfa makró, vonalzóval. |
| PG-043 · Ciclo de vida de la chinche de cama | scale | 1 | **IMG-ENT-SCALE-01**: Egy poloska vonalzó (mm) vagy érme mellett — méretarányos azonosító kép. |
| PG-044 · ¿Dónde se esconden las chinches de cama? | inline | 3 | **IMG-DRY-07**: Gőzölés bútorillesztésen / fiókvezetőn.<br>**IMG-INS-02**: Az ágykeret illesztéseinek átvizsgálása lámpával.<br>**IMG-INS-04**: A fejtámla hátoldalának átvizsgálása. |
| PG-045 · Chinches en el colchón: cómo revisarlo | inline | 1 | **IMG-DRY-04**: Szárazgőzös kezelés egy matracvarraton: a fúvóka a matrac szegélyvarrásán, a gőz látható, a matrac szövete jól látszik; a háttérben nincs ügyfél-azonosító adat. |
| PG-049 · Cómo eliminar las chinches de cama | inline | 1 | **IMG-DRY-09**: A teljes hálószoba szélesen, a gőzös kezelés közben (munkafolyamat). |
| PG-050 · ¿El vapor mata las chinches de cama? | inline | 1 | **IMG-DRY-03**: A Polti kezelőfeje közelről (10–20 cm), kezben, látható gőzzel. |
| PG-059 · Sellar grietas y huecos: qué puede y qué no puede hacer | inline | 3 | **IMG-CHEM-06**: Szegélyléc / rodapié kezelése.<br>**IMG-IPM-SEAL-01**: Falrepedés az ágy mellett.<br>**IMG-IPM-SEAL-02**: Rés a szegélyléc mögött. |

## D. Beillesztett képek jegyzéke
| Képazonosító | Fájlnév (alap) | Eredet | Képaláírás (ES) |
|---|---|---|---|
| IMG-ABOUT-02 | albert-janos-especialista-chinches-retrato | own | Albert János. Foto propia. |
| IMG-CRED-05 | certificado-lantra-awards-bed-bug-control | own | Certificado de formación «Bed Bug Control» (Lantra Awards, e-learning aprobado), 25/11/2026. Código de verificación ocultado. |
| IMG-DRY-01 | maquina-vapor-seco-polti-cimex-eradicator | own | Polti Cimex Eradicator, el equipo de vapor seco que se utiliza. Foto propia. |
| IMG-DRY-05 | vapor-seco-estructura-madera-cama | own | Aplicación de vapor seco en la estructura de madera de una cama. Foto propia. |
| IMG-DRY-10 | tratamiento-vapor-seco-sofa-polti | own | Vapor seco sobre un sofá tapizado durante un tratamiento. Foto propia. |
| IMG-CHEM-04 | aplicacion-dirigida-base-cama-lanza | own | Aplicación dirigida en el borde inferior de una cama. Foto propia. |
| IMG-CHEM-07 | nebulizacion-en-frio-mueble-volteado | own | Nebulización en frío como complemento sobre un mueble. Foto propia. |
| IMG-INS-01 | inspeccion-cama-linterna-ilustracion | illustration | Ilustración: revisión de una cama con linterna. No es una fotografía propia. |
| IMG-IPM-01 | inspeccion-sofa-cama-linterna-ilustracion | illustration | Ilustración: inspección de un sofá cama. No es una fotografía propia. |
| IMG-IPM-03 | equipos-tratamiento-integrado-ilustracion | illustration | Ilustración: tipos de equipo y registro de un tratamiento integrado. No es una fotografía propia. |
| IMG-IPM-04 | monitor-chinches-pata-cama-ilustracion | illustration | Ilustración: colocación de un monitor bajo la pata de la cama. No es una fotografía propia. |
| IMG-ENT-ADU-01 | chinche-de-cama-adulta-macro | unverified | Chinche de cama adulta sobre tejido. Imagen ilustrativa, sin escala; sexo y estadio sin determinar. |
| IMG-B2B-01 | dormitorio-apartamento-turistico | illustration | Dormitorio de un apartamento turístico (imagen ilustrativa). |
| IMG-B2B-02 | habitacion-alojamiento-dos-camas | unverified | Habitación de un alojamiento (imagen ilustrativa). |
| IMG-PREV-02 | habitacion-sencilla-cama-doble-e-individual | unverified | Habitación de un alojamiento (imagen ilustrativa). |
| IMG-LOC-ALC-02 | dormitorio-vivienda-cama-matrimonio | unverified | Dormitorio de una vivienda (imagen ilustrativa). |
| IMG-LOC-ALC-01 | alicante-paseo-explanada | unverified | Alicante: paseo de la Explanada. |
| IMG-LOC-BEN-01 | benidorm-playa-rascacielos-atardecer | unverified | Benidorm: playa y rascacielos al atardecer. |
| IMG-LOC-TOR-01 | torrevieja-urbanizacion-viviendas | unverified | Torrevieja: urbanización de viviendas. |
| IMG-LOC-CAL-01 | calpe-vista-panoramica-costa | unverified | Calpe: vista panorámica de la costa. |
| IMG-LOC-ALT-01 | altea-plaza-iglesia-cupulas-azules | unverified | Altea: plaza de la iglesia. |
| IMG-INS-06 | infestacion-chinches-suelo-junto-cama | own | Infestación real documentada. Foto propia. |
| IMG-ENT-EXC-02 | excrementos-chinches-superficie-lacada | own | Excrementos y mudas en una infestación real. Foto propia. |
| IMG-IPM-02 | manchas-oscuras-pared-litera-chinches | own | Marcas oscuras en la pared de un dormitorio con infestación real. Foto propia. |
| IMG-ENT-HID-01 | chinches-costura-colchon-infestado | own | Chinches en la costura de un colchón infestado. Foto propia. |
| IMG-ENT-HID-02 | chinches-somier-listones-uniones | own | Chinches en las uniones de un somier. Foto propia. |
| IMG-ENT-MOU-01 | mudas-chinches-tela-tapizada | own | Mudas de chinches en una tela. Foto propia. |
| IMG-ABOUT-05 | (ugyanaz a fájl mint IMG-DRY-01) | own | Polti Cimex Eradicator, el equipo de vapor seco que se utiliza. Foto propia. |
| IMG-ABOUT-07 | (ugyanaz a fájl mint IMG-DRY-05) | own | Aplicación de vapor seco en la estructura de madera de una cama. Foto propia. |
| IMG-INS-05 | (ugyanaz a fájl mint IMG-IPM-01) | illustration | Ilustración: inspección de un sofá cama. No es una fotografía propia. |
