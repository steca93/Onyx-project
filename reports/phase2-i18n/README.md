# Faza 2 (višejezično): performanse

| Stranica | HTML gzip KB pre → posle | Ugrađeni prevodi KB pre → posle¹ |
|---|---|---|
| sr početna | 26.3 → **17.1** (−35%) | 26.0 → **2.0** |
| sr kategorija | 22.9 → **13.3** (−42%) | 26.0 → **2.0** |
| sr proizvod | 26.8 → **17.7** (−34%) | 26.0 → **~2.4** |
| korpa | 17.9 → **8.7** (−51%) | 26.0 → **~2.6** |
| en početna | 26.3 → **17.5** (−33%) | 26.1 → **2.0** |
| en kategorija | 22.8 → **13.7** (−40%) | 26.1 → **2.0** |
| de proizvod | 26.1 → **16.6** (−36%) | 29.1 → **~2.4** |

¹ Posle promene stranica ima dva mala objekta: layout (~2 KB) i rutu (0.4–0.6 KB). Skripta meri prvi, a za rute sa sopstvenim prevodima zbir je upisan ručno. JS (~207 KB gzip) je nepromenjen, jer prevodi nikad nisu bili u JS chunkovima.

## Šta je promenjeno
- **Samo potrebni prevodi u browseru.**
  - `scripts/client-messages.mts` prolazi kroz import graf od svake rute i nalazi sve module koji se izvršavaju na klijentu (iza `"use client"` granice) i namespace-e koje koriste. Rezultat upisuje u `src/i18n/client-messages.generated.ts`.
  - `src/i18n/ClientMessages.tsx` šalje samo te namespace-e, samo za aktivni jezik: root layout dobija 8, a rute sa formama ili korpom dobijaju svoje.
  - Server-only tekstovi (uslovi, FAQ, dostava, SEO šabloni, početna…) više ne idu u browser.
  - `npm run typecheck` pada ako je generisani fajl zastareo.
  - Browser smoke test (`tests/seo/client-messages.prod.spec.ts`, 32 stranice u sr/en/de) pada na svaki `MISSING_MESSAGE`.
- **Statika po jeziku:** proizvodi se prerenderuju po jeziku; za en/de samo prevedeni, uz limit `STATIC_PRODUCTS_LIMIT` (200). Ostali se renderuju na prvi zahtev i keširaju.
- **Revalidacija:** `/api/revalidate` prihvata `{ type, id, slug }`. Jedan tag osvežava sva tri jezika, jer se podaci dohvataju jednom (srpski izvor) i prevod se primenjuje u memoriji. mu-plugin v1.1.0 šalje i `id`.

## Nije promenjeno
- Kategorije ostaju dinamičke (filteri u URL-u). U Next 16 bez Cache Components to znači dinamički render, ali su podaci keširani, pa render traje ~10 ms.
