# WPGraphQL timing

Endpoint: `woocommerce-1614143-6633101.cloudwaysapps.com` · 3 sequential runs each, median shown · 2026-09-28T22:51:05.000Z

| Query | Used by | Median ms | Range ms | Size KB | Nodes | Errors |
|---|---|---|---|---|---|---|
| Categories | layout (every page), home, sitemap | 750 | 472–827 | 1.8 | 12 | — |
| CategoryBySlug | category page | 419 | 414–518 | 0.4 | 0 | — |
| Products (category, 7) | category page p1 | 520 | 501–540 | 4.5 | 14 | — |
| Products (featured, 8) | home bestsellers | 504 | 495–518 | 0.2 | 0 | — |
| Products (newest, 9) | home fallback / search | 490 | 481–523 | 5.7 | 18 | — |
| ProductBySlug (+related) | product page | 518 | 485–626 | 8.7 | 11 | — |
| AllProductSlugs | generateStaticParams, sitemap | 588 | 483–791 | 3.3 | 32 | — |
| SearchIndex | /api/search-index, EN/DE search | 532 | 500–552 | 8.4 | 32 | — |
