# Posle — višejezična runda (faza 5)

Isti metod kao [`../baseline-i18n`](../baseline-i18n/README.md): `next build && next start`, live podaci, Lighthouse mobilni preset, medijana od 3 merenja.

## Pre → posle
| Stranica | Perf | LCP (ms) | CLS | TBT (ms) | HTML gzip KB | Ugrađeni prevodi KB | Ukupan prenos KB | JS gzip KB |
|---|---|---|---|---|---|---|---|---|
| sr početna | 95 → 95 | 2984 → 2904 | 0 → 0 | 0 → 0 | 26.3 → **17.2** | 26.0 → **2.0** | 431 → **417** | 207 → 207 |
| sr kategorija | 96 → 98 | 2837 → 2335 | 0 → 0 | 1 → 1 | 22.9 → **13.6** | 26.0 → **2.0** | 431 → **414** | 206 → 206 |
| sr proizvod | 95 → 95 | 2908 → 2907 | 0 → 0 | 1 → 0 | 26.8 → **17.9** | 26.0 → **~2.4** | 398 → **383** | 208 → 208 |
| korpa | 92 → 94 | 3386 → 3083 | 0 → 0 | 9 → 6 | 17.9 → **8.7** | 26.0 → **~2.6** | 374 → **359** | 208 → 208 |
| en početna | 98 → 94 | 2483 → 3058 | 0 → 0 | 0 → 0 | 26.3 → **17.5** | 26.1 → **2.0** | 432 → **417** | 207 → 207 |
| en kategorija | 99 → 95 | 2260 → 2910 | 0 → 0 | 1 → 0 | 22.8 → **14.0** | 26.1 → **2.0** | 429 → **415** | 206 → 206 |
| de proizvod | 95 → 95 | 2908 → 2910 | 0 → 0 | 0 → 0 | 26.1 → **16.7** | 29.1 → **~2.4** | 415 → **397** | 208 → 208 |

**Kako čitati LCP.** Na mobilnom Lighthouse profilu LCP je simulacija: ubrzana 4G veza i 4× usporen CPU. Ista stranica varira ±400 ms između pokretanja. Srpska i engleska kategorija su u baseline-u imale 2837 i 2260 ms, iako je stranica ista. Sporne stranice su zato izmerene ponovo sa 7 pokretanja ([`lh-7runs/`](lh-7runs/lighthouse.md)). Sve su u istom opsegu, LCP 2,76–3,06 s i skor 94–96, pa pad na en stranicama u tabeli iznad **nije regresija**, nego šum iz baseline merenja. Stvarno izmereni delovi LCP-a su nekoliko milisekundi (TTFB 4–8 ms).

**Šta se stvarno promenilo:** HTML je manji za 33–51%, a prenos za ~15 KB po stranici, jer ugrađeni prevodi idu sa 26–29 KB na ~2 KB. JS je nepromenjen. U laboratorijskom LCP-u to se ne vidi, jer njega određuje simulirano učitavanje slike i fonta. Koristi se vidi na sporim vezama i u vremenu parsiranja; za to prati real-user podatke (Vercel Speed Insights / CrUX) posle lansiranja.

INP se ne može izmeriti u laboratoriji. TBT (≤ 6 ms) je njegov proxy i svuda je daleko ispod praga.
