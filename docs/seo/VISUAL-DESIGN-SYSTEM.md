# VISUAL-DESIGN-SYSTEM — az új SEO-oldalak vizuális rendszere

Alapelv: a meglévő arculatból indul (tokenek a `assets/site.css`-ből: `--ink #1c2530`, `--night #121a24`, `--navy #23303e`, `--yellow #f5c800`, `--surface #f7f5ef`, `--gray #475767`, `--border #d9dcd9`, `--focus #1467ba`; DM Sans; `--shell 74rem`). Az új oldalak **külön CSS-fájlt** kapnak (`assets/seo.css`, `.sx-` előtagú osztályok); a `site.css`-hez nem nyúlunk (D-006).

## 1. Irány
Prémium, visszafogott, **szakmai dokumentum-érzet** (nem „AI-s sablon”): erős tipográfia, bőséges negatív tér, valódi fotók és saját ábrák. A sárga csak CTA-n és kulcsjelzésen; a sötétkék (`--night/--navy`) szekció-váltáshoz; világos (`--surface`) a hosszú olvasáshoz.

## 2. Tokenek (új oldalakon)
| Token | Érték | Használat |
|---|---|---|
| Szöveg | `--ink` #1c2530 · másodlagos `--gray` #475767 | törzs, meta |
| Háttér | #fff · `--surface` · `--night` (sötét szekció) | váltakozó ritmus |
| Akcentus | `--yellow` #f5c800 | **csak** CTA + egy kiemelés/oldal |
| Fókusz | `--focus` #1467ba, 3 px körvonal | minden interaktív elem |
| Kontraszt | törzs ≥ 7:1; másodlagos ≥ 4.5:1; sárga gombon `--night` szöveg | WCAG 2.2 AA |

Tipográfia (DM Sans, önhosztolva javasolt): H1 `clamp(2rem, 4vw+1rem, 3.5rem)` · H2 `clamp(1.5rem, 2.4vw+1rem, 2.25rem)` · H3 1.25rem · törzs 1.0625–1.125rem / 1.65 · max. sorhossz ~68 karakter. Két súly (400/700) + egy félkövér (600); nincs dekoratív betű.

Tér: 8 px alap; szekció-padding `clamp(3rem, 6vw, 6rem)`; sarok-lekerekítés **max. 0.5rem** (a meglévő 1.125rem helyett — kevesebb „kártyás” hatás); árnyék **nincs** (vékony 1 px `--border` vonal).

## 3. Elvek és tiltások
- **Nem minden szekció kártya.** Ritmus: teljes szélességű szöveg · oszlopos szöveg+kép · táblázat · idővonal · ábra · idézet-/megjegyzés-sáv. Kártya csak valódi elemgyűjteményhez (pl. szolgáltatás-lista).
- **Nincs:** gradiens, dekoratív animáció, stockfotó, ismétlődő azonos blokk-sor, hosszú falszöveg kép nélkül, CTA-t akadályozó elem.
- **Animáció:** csak funkcionális (lightbox-átmenet, accordion ≤ 200 ms); `prefers-reduced-motion` tiszteletben.
- **Képek:** tartalmi arányok 3:2 / 4:3 (fekvő), 1:1 (részlet); a hero a tartalom mellé kerül, nem szöveg mögé.

## 4. Komponenskönyvtár (`seo.css`, build-time sablonrészek)
Fejléc/lábléc (az éleshez azonos megjelenés) · nyelvváltó · breadcrumb · **hero** (3 variáns: szöveg+fotó, portré, hub) · **válaszdoboz** (rövid válasz) · **szerzői/ellenőr doboz** · **kulcstény-sáv** (3–4 tény) · folyamat-lépések (számozott) · **infografika-keret** (`<figure>` + ES/EN) · összehasonlító táblázat (reszponzív, görgethető) · **fotógaléria + lightbox** (billentyű, fókusz-csapda, ESC) · dokumentum-galéria · GYIK `<details>` · CTA-sáv (3 intenzitás: *teljes*, *közepes*, *visszafogott*) · kapcsolódó-témák lista · forráslista · tartalomjegyzék (jobb oldali, mobilon összecsukható) · figyelmeztető megjegyzés (orvosi/jogi korlát).

## 5. CTA-rendszer
Elsődleges: **WhatsApp** (sárga gomb, ikon + szöveg, `data-cta` és meglévő üzenetformátum), másodlagos: **telefon** (körvonalas). Mobil sticky-CTA: **csak tranzakciós oldalakon**, magassága ≤ 56 px + biztonsági sáv, nem takarja a navigációt/cookie-sávot (a meglévő `--privacy-offset` változót tiszteletben tartva), tesztelendő (TEST-PLAN). A meglévő WhatsApp-üzenetszövegeket a központi adatból generáljuk.

## 6. Reszponzivitás
Mobile-first; töréspontok 480 / 768 / 1024 / 1280; tartalom max. 74 rem; érintési célpont ≥ 44 px; táblázat mobilon vízszintesen görgethető, fejléc-oszlop rögzített; ábrák külön mobil-elrendezéssel.

## 7. Dokumentált kivételek
A legacy oldalak (404, gracias, jogi) eltérő sablont használnak; az egységesítés külön javaslat (P1-15, jóváhagyással).
