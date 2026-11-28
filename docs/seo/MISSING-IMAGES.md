# MISSING-IMAGES — egyszerűsített képhiánylista

Frissítve: 2026-11-28 (4. munkacsomag: új saját képek, atlasz-illusztrációk, munkaruhás portré). **Egyetlen hiányzó kép sem blokkolja a publikálást, és sehol nem jelenik meg üres képhely vagy helyőrző**: ahol nincs kép, a szekció kép nélkül, szövegesen jelenik meg. A meglévő anyagból gazdálkodunk; új képet nem generálunk és nem töltünk le.

## 1. Mi hiányzik még
**A teljes, oldalankénti és szekciónkénti hiánylista (képek + egyéb publikálási adatok): `docs/seo/PUBLICATION-MISSING-DATA.md`** — ez az egyetlen központi lista; itt csak az összefoglaló áll.
- Az atlaszból **2 fotó** hiányzik (IMG-ENT-MOU-02, IMG-ENT-EXC-01) és **2 infografika** (IG-04, IG-06); az atlasz 14 makrója jelenleg **jelölt AI-illusztráció**, valódi, ellenőrzött fotóra cserélendő (ajánlott, nem blokkoló).
- A többi képhely (szakmai bemutatkozás galéria, bizonyítványok, cikkek infografikái, hero-képek) szintén nem blokkol: a hiányzó kép nem jelenik meg.

### Miért nem kérünk többet (újraértékelt tételek)
| Korábban tervezett | Döntés | Indok |
|---|---|---|
| Dokumentálás munka közben | nem kérjük | A valós fertőzöttségi fotók és a fotódokumentáció pótolják |
| Eszközök előkészítése | nem kérjük | A Polti-gép, a vegyszeres/hidegköd saját fotók elegendők |
| Utóellenőrzés | nem kérjük | Nincs rá szükség a szakmai tartalomhoz |
| Okmányok: CRED-01/02/03 (magyar képesítés, nyilvántartás) | **kihagyva** | A tulajdonos döntése: a spanyol elismeréshez szükséges dokumentáció még készül; nincs megjelenítés |
| CRED-04 további tanúsítvány | nem szükséges | A Lantra „Bed Bug Control” tanúsítvány marad (kód elfedve) |
| Fotóatlasz (PG-070) | **teljes terv él** | 8 kategória, 8 szűrő, szakmai szöveg, forráslista; soronkénti lista: `ATLAS-IMAGE-LIST.md` |
| Opcionális képhelyek (P2/P3) és infografika-helyek | nem blokkolnak | Nem jelennek meg |

### A 4. munkacsomagban (2026-11-28) feldolgozott, de NEM használt nyers képek
| Nyers fájl | Ok |
|---|---|
| `12-uj-sajat/20260616_200148.jpg` | Olvasható biocid-terméknév a címkén (LGL-05: terméknév nem publikálható) |
| `12-uj-sajat/20251206_093321.jpg` | Redundáns a CHEM-07-tel; lakásbelső, bekeretezett képek |
| `12-uj-sajat/20260330_150107.jpg` | Redundáns (DRY-05 / DRY-04: gőzfej faágykereten) |
| `12-uj-sajat/20261029_130223.jpg` | Életlen, kesztyű és ruházat takarja; a HID-06 tisztábban mutatja ugyanazt |
| `12-uj-sajat/20261106_120442.jpg` | Gyakorlatilag azonos az IMG-ENT-EXC-02 képpel (ugyanaz a fejtámla, ugyanaz a szög) |
| `12-uj-sajat/20261110_135134.jpg` | 265×199 px bélyegkép, lakásbelső |
| `10-varosok/altea.avif`, `04-vegyszeres/hidekodkepzes-munka-kozben.webp` | Korábbi döntés (felismerhető személyek / családi fényképek) |

## 2. Beillesztett képek (52 fájl, 55 képazonosító) és a videó
Eredet: 25 saját fotó/dokumentum, 19 AI-illusztráció, 8 Unsplash-kép. A besorolás a tulajdonos megerősítésén alapul (három forrás: Unsplash, AI-generált, saját); hogy a nem saját fájlok közül melyik AI és melyik Unsplash, a fájl megjelenéséből következtettem — kérem, javítsa, ha téves (a felirat és a nyilvántartás egy sorban módosítható: `tools/fill-image-assignments.mjs`).

| Képazonosító | Fájlnév (alap) | Forrás | Hol szerepel | Képaláírás (ES) |
|---|---|---|---|---|
| IMG-ABOUT-02 | albert-janos-especialista-chinches-retrato | Saját fotó (magyarországi munka) | Szakmai bemutatkozás | Albert János. Foto propia. |
| IMG-CRED-05 | certificado-lantra-awards-bed-bug-control | Saját fotó (magyarországi munka) | Szakmai bemutatkozás | Certificado de formación «Bed Bug Control» (Lantra Awards, e-learning aprobado), 25/11/2026. Código de verificación ocultado. |
| IMG-DRY-01 + IMG-ABOUT-05 | maquina-vapor-seco-polti-cimex-eradicator | Saját fotó (magyarországi munka) | Szárazgőzös kezelés, Szakmai bemutatkozás | Polti Cimex Eradicator, el equipo de vapor seco que se utiliza. Foto propia. |
| IMG-DRY-05 + IMG-ABOUT-07 | vapor-seco-estructura-madera-cama | Saját fotó (magyarországi munka) | Szárazgőzös kezelés, Szakmai bemutatkozás | Aplicación de vapor seco en la estructura de madera de una cama. Foto propia. |
| IMG-DRY-10 | tratamiento-vapor-seco-sofa-polti | Saját fotó (magyarországi munka) | Szárazgőzös kezelés | Vapor seco sobre un sofá tapizado durante un tratamiento. Foto propia. |
| IMG-CHEM-04 | aplicacion-dirigida-base-cama-lanza | Saját fotó (magyarországi munka) | Vegyszeres kezelés | Aplicación dirigida en el borde inferior de una cama. Foto propia. |
| IMG-CHEM-07 | nebulizacion-en-frio-mueble-volteado | Saját fotó (magyarországi munka) | Vegyszeres kezelés | Nebulización en frío como complemento sobre un mueble. Foto propia. |
| IMG-INS-01 | inspeccion-cama-linterna-ilustracion | AI-generált illusztráció | Felderítés és diagnosztika | Ilustración: revisión de una cama con linterna. No es una fotografía propia. |
| IMG-IPM-01 + IMG-INS-05 | inspeccion-sofa-cama-linterna-ilustracion | AI-generált illusztráció | Integrált kártevőirtás (IPM), Felderítés és diagnosztika | Ilustración: inspección de un sofá cama. No es una fotografía propia. |
| IMG-IPM-03 | equipos-tratamiento-integrado-ilustracion | AI-generált illusztráció | Integrált kártevőirtás (IPM) | Ilustración: tipos de equipo y registro de un tratamiento integrado. No es una fotografía propia. |
| IMG-IPM-04 | monitor-chinches-pata-cama-ilustracion | AI-generált illusztráció | Monitorozás | Ilustración: colocación de un monitor bajo la pata de la cama. No es una fotografía propia. |
| IMG-ENT-ADU-01 | chinche-de-cama-adulta-macro | Unsplash fotó | Az ágyi poloska életciklusa, Fotóatlasz | Chinche de cama adulta sobre tejido. Imagen ilustrativa, sin escala; sexo y estadio sin determinar. |
| IMG-B2B-01 | dormitorio-apartamento-turistico | AI-generált illusztráció | Szálláshelyek: megelőzés és monitorozás, Benidorm (városi oldal) | Dormitorio de un apartamento turístico (imagen ilustrativa). |
| IMG-B2B-02 | habitacion-alojamiento-dos-camas | Unsplash fotó | Szálláshelyi protokoll | Habitación de un alojamiento (imagen ilustrativa). |
| IMG-PREV-02 | habitacion-sencilla-cama-doble-e-individual | Unsplash fotó | Utazás és szállodák | Habitación de un alojamiento (imagen ilustrativa). |
| IMG-LOC-ALC-02 | dormitorio-vivienda-cama-matrimonio | Unsplash fotó | Alicante (városi oldal) | Dormitorio de una vivienda (imagen ilustrativa). |
| IMG-LOC-ALC-01 | alicante-paseo-explanada | Unsplash fotó | Szolgáltatási területek, Alicante (városi oldal) | Alicante: paseo de la Explanada. |
| IMG-LOC-BEN-01 | benidorm-playa-rascacielos-atardecer | Unsplash fotó | Szolgáltatási területek, Benidorm (városi oldal) | Benidorm: playa y rascacielos al atardecer. |
| IMG-LOC-TOR-01 | torrevieja-urbanizacion-viviendas | Unsplash fotó | Szolgáltatási területek, Torrevieja (városi oldal) | Torrevieja: urbanización de viviendas. |
| IMG-LOC-CAL-01 | calpe-vista-panoramica-costa | Unsplash fotó | Szolgáltatási területek | Calpe: vista panorámica de la costa. |
| IMG-INS-06 | infestacion-chinches-suelo-junto-cama | Saját fotó (magyarországi munka) | Miért tér vissza az ágyi poloska, Fotóatlasz, Valós esetek / fertőzöttségi fotók | Infestación real documentada. Foto propia. |
| IMG-ENT-EXC-02 | excrementos-chinches-superficie-lacada | Saját fotó (magyarországi munka) | Hogyan ismerd fel az ágyi poloskát, Fotóatlasz, Valós esetek / fertőzöttségi fotók | Excrementos y mudas en una infestación real. Foto propia. |
| IMG-IPM-02 | manchas-oscuras-pared-litera-chinches | Saját fotó (magyarországi munka) | Rések és repedések lezárása, Fotóatlasz, Valós esetek / fertőzöttségi fotók | Marcas oscuras en la pared de un dormitorio con infestación real. Foto propia. |
| IMG-ENT-HID-01 | chinches-costura-colchon-infestado | Saját fotó (magyarországi munka) | Hol bújnak meg az ágyi poloskák, Ágyi poloska a matracban, Fotóatlasz, Valós esetek / fertőzöttségi fotók | Chinches en la costura de un colchón infestado. Foto propia. |
| IMG-ENT-HID-02 | chinches-somier-listones-uniones | Saját fotó (magyarországi munka) | Hol bújnak meg az ágyi poloskák, Fotóatlasz, Valós esetek / fertőzöttségi fotók | Chinches en las uniones de un somier. Foto propia. |
| IMG-ENT-MOU-01 | mudas-chinches-tela-tapizada | Saját fotó (magyarországi munka) | Hogyan ismerd fel az ágyi poloskát, Fotóatlasz, Valós esetek / fertőzöttségi fotók | Mudas de chinches en una tela. Foto propia. |
| IMG-ABOUT-01 | albert-janos-mono-trabajo-retrato | Saját fotó (magyarországi munka) | Szakmai bemutatkozás | Albert János con ropa de trabajo. Foto propia. |
| IMG-ENT-ADU-02 | chinche-de-cama-adulta-vista-dorsal-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: chinche de cama adulta en vista dorsal. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-ADU-03 | chinche-de-cama-adulta-aplanada-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: chinche de cama adulta de cuerpo aplanado y color pardo (aspecto de un ejemplar sin alimentar). La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-ADU-04 | chinche-adulta-aplanada-y-alimentada-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: dos adultos: uno aplanado y pardo y otro de abdomen redondeado y rojizo, como tras alimentarse. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-ADU-05 | chinche-cabeza-pronoto-detalle-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: detalle de la cabeza y el pronoto de una chinche de cama; no sirve para determinar la especie. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-EGG-01 | huevos-chinche-aislados-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: huevos de chinche de cama aislados. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-EGG-02 | huevos-chinche-agrupados-costura-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: grupo de huevos de chinche de cama en el pliegue de un tejido. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-EGG-03 | huevos-chinche-eclosionados-cascaras-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: cáscaras vacías de huevos eclosionados, con la abertura de salida. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-NYM-01 | ninfa-chinche-estadio-1-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: ninfa de chinche de cama; ilustración orientativa del estadio 1 de 5, no verificada por un especialista. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-NYM-02 | ninfa-chinche-estadio-2-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: ninfa de chinche de cama; ilustración orientativa del estadio 2 de 5, no verificada por un especialista. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-NYM-03 | ninfa-chinche-estadio-3-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: ninfa de chinche de cama; ilustración orientativa del estadio 3 de 5, no verificada por un especialista. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-NYM-04 | ninfa-chinche-estadio-4-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: ninfa de chinche de cama; ilustración orientativa del estadio 4 de 5, no verificada por un especialista. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-NYM-05 | ninfa-chinche-estadio-5-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: ninfa de chinche de cama; ilustración orientativa del estadio 5 de 5, no verificada por un especialista. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-SCALE-01 | chinche-adulta-con-regla-milimetrada-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: chinche de cama adulta junto a una regla. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-SCALE-02 | chinche-huevo-ninfas-adulto-escala-ilustracion | AI-generált illusztráció | Fotóatlasz | Ilustración: huevo, cinco ninfas y un adulto ordenados por tamaño. La regla es ilustrativa y no sirve para medir. No es una fotografía propia. |
| IMG-ENT-HID-03 | chinches-estructura-mueble-tapizado-herraje | Saját fotó (magyarországi munka) | Fotóatlasz | Chinches y manchas en la estructura de un mueble tapizado. Foto propia. |
| IMG-ENT-HID-04 | chinches-cabecero-costras-excrementos | Saját fotó (magyarországi munka) | Fotóatlasz | Excrementos de chinches en un cabecero. Foto propia. |
| IMG-ENT-HID-05 | chinches-esquina-pared-techo-manchas | Saját fotó (magyarországi munka) | Fotóatlasz | Rastros de chinches en la esquina de una pared. Foto propia. |
| IMG-ENT-HID-06 | chinches-costura-tapizado-oscuro-grapa | Saját fotó (magyarországi munka) | Fotóatlasz | Chinches en la costura de un tapizado. Foto propia. |
| IMG-SEV-01 | chinche-costura-colchon-azul-infestacion-incipiente | Saját fotó (magyarországi munka) | Fotóatlasz | Infestación incipiente: un posible ejemplar en la costura de un colchón. Foto propia. |
| IMG-SEV-02 | chinches-rincon-mueble-tapizado-varios-focos | Saját fotó (magyarországi munka) | Fotóatlasz | Infestación moderada: varios focos en un mueble tapizado. Foto propia. |
| IMG-INS-07 | chinches-costura-colchon-revision | Saját fotó (magyarországi munka) | Ágyi poloska a matracban | Chinches y huevos en la costura de un colchón. Foto propia. |
| IMG-DRY-04 | vapor-seco-cabezal-estructura-cama-guante | Saját fotó (magyarországi munka) | Szárazgőzös kezelés, PG-050 | Aplicación de vapor seco en la estructura de una cama. Foto propia. |
| IMG-PREP-01 | cama-desmontada-colchon-apartado-vapor | Saját fotó (magyarországi munka) | PG-055 | Cama desmontada y colchón apartado para poder tratar cada pieza. Foto propia. |
| IMG-CHEM-09 | nebulizador-frio-pulverizador-presion-suelo | Saját fotó (magyarországi munka) | Hogyan irtható az ágyi poloska | Nebulizador en frío y pulverizador a presión preparados para el tratamiento. Foto propia. |
| IMG-CHEM-10 | pulverizador-acero-caja-sofa-cama | Saját fotó (magyarországi munka) | Vegyszeres kezelés | Aplicación dirigida en la caja de un sofá cama. Foto propia. |
| (videó) | vapor-seco-cabezal-polti-sofa-infestado.webm + poster | Saját videó (magyarországi munka) | Szárazgőzös kezelés (ES/EN) | Vídeo corto, sin audio: el cabezal de vapor Polti junto a un sofá con una infestación real. |

## 3. Képforrások és felhasználási jog
- **Unsplash:** kereskedelmi felhasználásra szolgál, forrásmegjelölés nem kötelező (a szerzőt nem rögzítettük). Felismerhető személyek közeli képe nem használható; az Altea-fotó ezért kimaradt.
- **AI-illusztrációk:** mindig „Ilustración … No es una fotografía propia” felirattal; saját helyszíni dokumentációként nem szerepelnek. Az atlasz 14 makrója (ADU-02…05, EGG-01…03, NYM-01…05, SCALE-01…02) az 1448×1086 / 1536×1024 PNG formátum alapján AI-generált; a vonalzójuk illusztratív, a stádium/nem/faj nem ellenőrzött. **Ha valódi saját fotók, jelezd, és `provenance: own`-ra állítjuk.**
- **Saját fotók és videó:** magyarországi munkák; **nem** szerepelnek spanyolországi esetként, hely/dátum/kezelési eredmény/ügyféltörténet nincs megadva; a felismerhető személyes adatokat kitakartuk (tanúsítvány-kód), a fertőzöttségi fotók tartalmát nem módosítottuk. Nem használt: `hidekodkepzes-munka-kozben.webp` (családi fényképek látszanak a vitrinben).
