import type { Metadata } from "next";
import { Bestsellers } from "@/components/sections/Bestsellers";
import { Categories } from "@/components/sections/Categories";
import { Hero } from "@/components/sections/Hero";
import { KitCarousel } from "@/components/sections/KitCarousel";
import { SplitPromo } from "@/components/sections/SplitPromo";
import { WarrantyBlock } from "@/components/sections/WarrantyBlock";
import { CtaBand } from "@/components/ui/CtaBand";
import { SpecTicker } from "@/components/ui/SpecTicker";
import { siteSettings } from "@/data/site-settings";
import {
  getAllCategories,
  getFeaturedProducts,
  getKits,
  getProductsByCategory,
  searchProducts,
} from "@/lib/repo";

const SPEC_TICKER_ITEMS = [
  `${siteSettings.warrantyYears} GODINA GARANCIJE`,
  "SAMOOBNAVLJAJUĆI TOP COAT",
  "8 MIL / 200 µm",
  "PROZIRNOST 99%",
  "40+ OVLAŠĆENIH CENTARA",
];

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: `${siteSettings.brandName} ${siteSettings.brandSuffix}`,
  description:
    "Ovlašćeni distributer PPF folija i keramičkih premaza za automobile u Srbiji.",
  telephone: siteSettings.contact.phone,
  email: siteSettings.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteSettings.contact.address,
    addressCountry: "RS",
  },
};

export const metadata: Metadata = {
  title: "ONYX EVOLUTION — PPF folije i keramički premazi",
  description:
    "Ovlašćeni distributer PPF folija i keramičkih premaza za automobile u Srbiji. Garancija do 12 godina, montaža u ovlašćenim centrima.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ONYX EVOLUTION",
    description:
      "PPF folije i keramički premazi sa fabričkom garancijom. Ovlašćena distribucija i mreža instalatera u Srbiji i regionu.",
    type: "website",
    locale: "sr_RS",
  },
};

const POLISHING_PADS_CATEGORY_SLUG = "ulozak-za-poliranje";

export default async function Home() {
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
    ).toUpperCase(),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <Hero />
      <SpecTicker items={SPEC_TICKER_ITEMS} />
      {kitCards.length > 0 && <KitCarousel kits={kitCards} />}
      <SplitPromo image={polishingPads.products[0]?.image} />
      <Bestsellers products={bestsellers} />
      <WarrantyBlock />
      <Categories categories={shoppableCategories} />
      <CtaBand
        eyebrow="OGRANIČENA SERIJA"
        headingLine1="Nova generacija"
        headingLine2="PPF zaštite"
        body="Debljina 200 µm, samoobnavljajući sloj i lepak koji ne ostavlja tragove pri skidanju."
        buttonLabel="ISTRAŽI NOVITETE"
        buttonHref="/kategorija/ppf-auto-folija"
      />
    </>
  );
}
