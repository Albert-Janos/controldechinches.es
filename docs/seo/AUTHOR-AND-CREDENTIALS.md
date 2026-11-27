# AUTHOR-AND-CREDENTIALS — személyes szakmai márka terve

Oldal: `/sobre-mi/` · `/en/about/` (PG-016). A személy a hitelesség központi eleme — **kizárólag igazolt tényekkel**.

## 1. Szabályok
- Név: *Albert János*; pontos szakmai megnevezés a tényleges bizonyítvány szerint (magyar: „egészségügyi kártevőirtó” — a hivatalos magyar megnevezés és a spanyol/angol megfelelő **egyeztetendő**).
- **A magyar képesítés nem azonos spanyolországi működési engedéllyel.** Nem írunk olyat, ami ezt sugallja (LGL-07). A spanyolországi elismerés és a ROESB-követelmények forrása: hivatalos, aktuális hatósági oldal (a P0 keresés csak az általános keretet igazolta; **a valenciai alkalmazói képzettségi követelmény nem lett igazolva** → jogi ellenőrzés).
- Fiktív képesítés, tagság, jogosultság, tapasztalat tilos. Amit a tulajdonos nem adott meg, nem szerepel.
- Személyes adat a nyilvános bizonyítvány-képen: törlés **visszafordíthatatlanul** (a nyilvános fájl a kitakart képből készül, nem rétegként).

## 2. Oldalszerkezet (T-D)
| Szekció | Tartalom | Kép |
|---|---|---|
| Hero | név, szakmai megnevezés, egy mondatos tényszerű pozíció, CTA | IMG-ABOUT-01 fekvő portré munkaruhában |
| Bemutatkozás | 3–5 mondat tény | IMG-ABOUT-02 álló portré |
| Szakmai életút | idővonal (csak megadott tények) | IMG-ABOUT-03 |
| Végzettségek | magyar egészségügyi kártevőirtó bizonyítvány; nyilvántartási adat (csak ha igazolt és nyilvánosságra hozható) | IMG-CRED-01..03 |
| Tanúsítványok és továbbképzések | tényleges dokumentumok listája | IMG-CRED-04..06 (galéria, nagyítható) |
| Ágyi poloska specializáció | miért kizárólag ez | IMG-ABOUT-04 makró/munka közben |
| Eszközök és technológia | saját gép(ek) valós típusa | IMG-ABOUT-05 teljes gép, IMG-ABOUT-06 felszerelés |
| IPM-szemlélet, alapelvek | link PG-011 | IMG-ABOUT-07 munka közben |
| Szakmai célok / a spanyol vállalkozás célja | tulajdonos fogalmazza | – |
| Folyamatos továbbképzés | tényleges kurzusok | – |
| Munkafotók | 3–4 kép | IMG-ABOUT-08..10 |
| Kapcsolat | CTA | IMG-ABOUT-01 újrahasználva |

## 3. Közös szerzői komponens („Szerző és szakmai ellenőrző”)
Megjelenik a szakmai oldalak alatt: portré (kicsi), név, szerepkör (*Szerző* / *Szakmai ellenőrző* — **csak a tényleges közreműködés alapján**), egy mondat, link `/sobre-mi/`, a tartalom publikálás-/frissítés dátuma. JSON-LD: `Person` `@id` hivatkozás az `Article.author`-ban (STRUCTURED-DATA).

## 4. Tulajdonosi kérdéslista (→ OWNER-INPUT #13–#24)
1. Pontos hivatalos megnevezés és kiállító intézmény, kiállítás éve a bizonyítványon.
2. Magyar nyilvántartási szám/link, nyilvánosságra hozható-e?
3. Minden továbbképzés: cím, szervező, ország, év, dokumentum.
4. Működési státusz Spanyolországban (ROESB-bejegyzés? alkalmazotti/alvállalkozói viszony? engedélyezett cég?) — jogi egyeztetéshez.
5. Magyarországi gyakorlati tapasztalat: évek, ügyfélkör, mennyire nyilvános?
6. Használt gépek/eszközök valós típusa (a meglévő gőzfotón **nem** Polti Cimex Eradicator látszik).
7. Szakmai alapelvek (saját szavakkal), célok.
8. Ellenőrző szakember (ha van külső entomológus/szakértő): neve, bevonásának módja — csak akkor szerepel.
9. Hozzájárulás a portré/munkafotók publikálásához és az EN/ES bemutatkozás szövegéhez.

## 5. Dokumentumgaléria-koncepció
Lightbox, billentyűzetbarát, `alt` = „Egészségügyi kártevőirtó bizonyítvány, kitakart személyes adatokkal”; feliratok ES/EN; kicsi bélyegkép → nagyítás (max. 1600 px hosszú oldal); eredeti, kitakarás nélküli fájl **nem** kerül a publikus tárba. Részletek: IMAGE-SEO-SPEC §Dokumentumok.
