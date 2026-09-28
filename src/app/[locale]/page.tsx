import type { Metadata } from "next";
import { ClientMessages } from "@/i18n/ClientMessages";
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";
import { Bestsellers } from "@/components/sections/Bestsellers";
import { Categories } from "@/components/sections/Categories";
import { Hero } from "@/components/sections/Hero";
import { KitCarousel } from "@/components/sections/KitCarousel";
import { SplitPromo } from "@/components/sections/SplitPromo";
import { WarrantyBlock } from "@/components/sections/WarrantyBlock";
import { CtaBand } from "@/components/ui/CtaBand";
import { SpecTicker } from "@/components/ui/SpecTicker";
import { siteSettings } from "@/data/site-settings";
import { toLocale } from "@/i18n/routing";
import {
  getAllCategories,
  getFeaturedProducts,
  getKits,
  getProductsByCategory,
  searchProducts,
} from "@/lib/repo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return buildMetadata({
    locale,
    href: "/",
    title: t("title"),
    absoluteTitle: true,
    description: t("metaDescription", { years: siteSettings.warrantyYears }),
  });
}

const POLISHING_PADS_CATEGORY_SLUG = "ulozak-za-poliranje";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const tTicker = await getTranslations({ locale, namespace: "SpecTicker" });

  const [kits, featured, categories, polishingPads] = await Promise.all([
    getKits(4),
    getFeaturedProducts(8),
    getAllCategories(),
    // Only the image off the first product is used below — skip the
    // category lookup entirely instead of fetching and discarding it.
    getProductsByCategory(POLISHING_PADS_CATEGORY_SLUG, { perPage: 1, skipCategory: true }),
  ]);

  // Nothing is flagged "Featured" in WooCommerce yet — fall back to the
  // newest real products instead of leaving the homepage section empty.
  const bestsellers = featured.length
    ? featured
    : (await searchProducts("", { perPage: 8, sort: "newest" })).products;

  // Parent terms with no products of their own (WooCommerce category tree —
  // e.g. "Poliranje" holding only the "Uložak za poliranje" child) would
  // otherwise show up as a tile leading to an empty page.
  const shoppableCategories = categories.filter((c) => (c.count ?? 0) > 0);

  const kitCards = kits.map((product) => ({
    product,
    kicker: (
      product.productCategories.nodes[1]?.name ??
      product.productCategories.nodes[0]?.name ??
      ""
    ).toLocaleUpperCase(locale),
  }));

  const specTickerItems = [
    tTicker("warranty", { years: siteSettings.warrantyYears }),
    tTicker("selfHealing"),
    tTicker("thickness"),
    tTicker("clarity"),
    tTicker("centers"),
  ];

  return (
    <ClientMessages locale={locale} route="">
      <JsonLd
        data={[
          organizationJsonLd(t("organizationDescription")),
          webSiteJsonLd({
            homeUrl: absoluteUrl("/", locale),
            language: locale,
            searchUrlTemplate: `${absoluteUrl("/pretraga", locale)}?q={search_term_string}`,
          }),
        ]}
      />
      <Hero />
      <SpecTicker items={specTickerItems} />
      {kitCards.length > 0 && <KitCarousel kits={kitCards} />}
      <SplitPromo image={polishingPads.products[0]?.image} />
      <Bestsellers products={bestsellers} />
      <WarrantyBlock />
      <Categories categories={shoppableCategories} />
      <CtaBand
        eyebrow={t("ctaEyebrow")}
        headingLine1={t("ctaHeadingLine1")}
        headingLine2={t("ctaHeadingLine2")}
        body={t("ctaBody")}
        buttonLabel={t("ctaButton")}
        buttonHref={{ pathname: "/kategorija/[slug]", params: { slug: "ppf-auto-folija" } }}
      />
    </ClientMessages>
  );
}
