# Višejezični baseline (faza 1)

Merenja rađena na `main` posle PR #3, pre ove runde. `next build && next start`, live podaci, Lighthouse mobilni preset, medijana od 3 merenja. Stranice: srpske home/kategorija/proizvod/korpa, plus `/en`, `/en/category/…` i `/de/produkt/…`.

- [`lighthouse.md`](lighthouse.md): performanse (skor, LCP, CLS, TBT, prenos).
- [`bundle.md`](bundle.md): JS po ruti, veličina HTML-a i **ugrađenih prevoda** (novo).
- [`graphql.md`](graphql.md): WPGraphQL upiti.

## Nalazi
1. **Svaka stranica nosi ceo katalog prevoda za aktivni jezik**: 26 KB (sr/en) do 29 KB (de) u RSC payload-u, i to na svakoj ruti. Na korpi je to 37% HTML-a (26 od 70 KB). Klijentske komponente koriste oko 22 od 48 namespace-a. Tekstovi poput uslova korišćenja, FAQ-a i SEO šablona idu u browser bez potrebe. Druga dva jezika se **ne** šalju.
2. **JS je isti na svim jezicima** (~207 KB gzip): prevodi ne ulaze u JS chunkove, nego u HTML payload.
3. **Izvor prevoda sadržaja** je repo overlay (`src/i18n/catalog/{en,de}.json`), ne WordPress. Pokrivenost je 32/32 proizvoda i 11/11 kategorija za en i de.
4. **URL šema:**
   - sr bez prefiksa (`/proizvod/{slug}`, `/kategorija/{slug}`);
   - en `/en/product/{slug}`, `/en/category/{slug}`;
   - de `/de/produkt/{slug}`, `/de/kategorie/{slug}`;
   - slug je isti srpski WooCommerce slug u svim jezicima.
5. **Valuta:** samo RSD, u svim jezicima. Nema konverzije i neće je biti.
6. **Automatski redirect po jeziku:** ne postoji (`localeDetection: false`). ✅
