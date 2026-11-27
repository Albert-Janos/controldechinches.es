# MULTILINGUAL-SEO — spanyol és angol

## 1. Szerkezet
ES gyökérben, EN a `/en/` alatt, **angol slug-okkal** (PAGE-INVENTORY `url_en`). Minden elsődleges szolgáltatási, lokális és szakmai márkaoldal mindkét nyelven készül; a tudásközpont-cikkek EN-párja az EN-prioritású témáknál az első hullámban (041, 042, 048, 049, 053), a többinél a 2–3. hullámban. **Nincs EN-oldal ES-pár nélkül és fordítva** (a build-validáció hibát jelez); ahol egy EN-oldal nem készül el, a nyelvváltó a legközelebbi értelmes oldalra (hub) mutat, **nem** 404-re.

## 2. Jelölés
`<html lang="es">` / `lang="en"` · önmagára mutató canonical · **kölcsönös** `hreflang` (ES, EN, `x-default`=ES) a HTML-ben **és** a sitemapban (ahogy a meglévő oldalak) · `og:locale` es_ES / en_GB · nyelvváltó a valódi megfelelőre (a meglévő minta: `lang`, `hreflang`, `aria-current`).
Megjegyzés: az `en` nem országspecifikus; a Costa Blanca angol nyelvű közönsége UK/IE/EU — nem külön en-GB/en-IE URL.

## 3. Lokalizáció, nem tükörfordítás
| Szempont | ES | EN |
|---|---|---|
| Szándék | „chinches de cama”, „control de plagas”, „precio” | „bed bug treatment”, „holiday let”, „expat”, „what to do on holiday” |
| Hang | tegező lakossági; B2B tárgyilagos | tárgyilagos, rövid, nemzetközi olvasónak |
| Szakkifejezés | GIP, chinche de cama, vapor seco | IPM, bed bug, dry steam; *Cimex lectularius* közös |
| Jogi/hatósági | spanyol hatósági források | spanyol hatósági források + angol magyarázat; ROESB röviden magyarázva |
| CTA | WhatsApp „Hola…” | WhatsApp „Hello…” (meglévő EN üzenetek); hívás: az AI-asszisztens **spanyol** → EN-oldalon tájékoztató sor/WhatsApp-preferencia |

Kerüld: indokolatlan *profesional/professional*; üres marketingjelzők; fordítási szagú szerkezet.

## 4. Kulcsszótérkép
Külön ES és EN térkép (`KEYWORD-URL-MAP.csv` `language` oszlop); az EN oldalak saját elsődleges kulcsszót kapnak, nem az ES-é fordítását.

## 5. Média
Lokalizált alt és képaláírás (inventory `alt_es/en`, `caption_es/en`); az infografikák ES/EN változatban; a PDF-ek (PG-072) mindkét nyelven, HTML-változattal.

## 6. Magyar jelentés jóváhagyáshoz
Minden fontos idegen nyelvű szöveghez (title, H1, rövid válasz, CTA, jogi/szakmai állítás) a brief mellé **magyar jelentés** kerül; a tulajdonos a magyarra bólint, nem a spanyolra/angolra.

## 7. Ellenőrzés
Build: hreflang-párok, `lang` attribútum, EN oldal ES-link nélkül nem engedett, azonos H1 két nyelven csak ha indokolt; kézi: anyanyelvi lektorálás (ES, EN) a szakmai ellenőrzés mellett.
