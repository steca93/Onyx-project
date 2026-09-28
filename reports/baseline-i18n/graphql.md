# WPGraphQL timing

Endpoint: `woocommerce-1614143-6633101.cloudwaysapps.com` · 3 sequential runs each, median shown · 2026-09-28T22:14:16.097Z

| Query | Used by | Median ms | Range ms | Size KB | Nodes | Errors |
|---|---|---|---|---|---|---|
| Categories | layout (every page), home, sitemap | 537 | 494–646 | 1.8 | 12 | — |
| CategoryBySlug | category page | 455 | 451–520 | 0.4 | 0 | — |
| Products (category, 7) | category page p1 | 522 | 515–553 | 4.5 | 14 | — |
| Products (featured, 8) | home bestsellers | 487 | 480–526 | 0.2 | 0 | — |
| Products (newest, 9) | home fallback / search | 579 | 533–725 | 5.7 | 18 | — |
| ProductBySlug (+related) | product page | 563 | 535–624 | 8.7 | 11 | — |
| AllProductSlugs | generateStaticParams, sitemap | 522 | 519–562 | 3.3 | 32 | — |
| SearchIndex | /api/search-index, EN/DE search | 623 | 509–635 | 8.4 | 32 | — |
