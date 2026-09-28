import type {
  BreadcrumbList,
  ItemList,
  Offer,
  AggregateOffer,
  Organization,
  Product,
  WebSite,
  WithContext,
} from "schema-dts";
import type { AnyProduct, StockStatus } from "@/lib/repo/types";
import { siteSettings } from "@/data/site-settings";
import { stripHtml } from "@/lib/utils/strip-html";
import { optimizedImagePath } from "@/lib/utils/image-url";
import { BRAND, SITE_URL } from "./env";

/**
 * Renders structured data. `<` is escaped so text coming from WordPress
 * (names, descriptions) can never close the <script> element.
 */
export function JsonLd({ data }: { data: WithContext<Product | BreadcrumbList | ItemList | Organization | WebSite>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data.length === 1 ? data[0] : data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const AVAILABILITY: Record<StockStatus, Offer["availability"]> = {
  IN_STOCK: "https://schema.org/InStock",
  OUT_OF_STOCK: "https://schema.org/OutOfStock",
  ON_BACKORDER: "https://schema.org/BackOrder",
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd(description: string): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description,
    email: siteSettings.contact.email,
    telephone: siteSettings.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bulevar Oslobođenja 12",
      postalCode: "11000",
      addressLocality: "Beograd",
      addressCountry: "RS",
    },
  };
}

export function webSiteJsonLd(opts: {
  homeUrl: string;
  language: string;
  /** Search URL with the literal `{search_term_string}` placeholder. */
  searchUrlTemplate: string;
}): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${opts.homeUrl}#website`,
    name: BRAND,
    url: opts.homeUrl,
    inLanguage: opts.language,
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: opts.searchUrlTemplate },
      // schema-dts doesn't model the `query-input` shorthand Google documents.
      ...({ "query-input": "required name=search_term_string" } as object),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(name: string, urls: string[]): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: urls.length,
    itemListElement: urls.map((url, index) => ({ "@type": "ListItem", position: index + 1, url })),
  };
}

function toNumber(price: string | null | undefined): number | null {
  const n = price ? Number.parseFloat(price) : Number.NaN;
  return Number.isFinite(n) ? n : null;
}

export function productJsonLd(product: AnyProduct, url: string): WithContext<Product> {
  const images = [product.image, ...product.galleryImages.nodes]
    .filter((img): img is NonNullable<typeof img> => Boolean(img?.sourceUrl))
    // Served from the storefront domain, not WordPress.
    .map((img) => `${SITE_URL}${optimizedImagePath(img.sourceUrl, 1200)}`);
  const description = stripHtml(product.shortDescription) || stripHtml(product.description);
  const category = product.productCategories.nodes[0]?.name;

  let offers: Offer | AggregateOffer | undefined;
  if (product.__typename === "VariableProduct" && product.variations.nodes.length > 0) {
    const prices = product.variations.nodes
      .map((v) => toNumber(v.price))
      .filter((n): n is number => n !== null);
    if (prices.length > 0) {
      const anyInStock = product.variations.nodes.some((v) => v.stockStatus === "IN_STOCK");
      offers = {
        "@type": "AggregateOffer",
        priceCurrency: "RSD",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability: anyInStock ? AVAILABILITY.IN_STOCK : AVAILABILITY[product.stockStatus],
        url,
      };
    }
  } else {
    const price = toNumber(product.price);
    if (price !== null) {
      const onSale = product.salePrice && product.salePrice === product.price;
      offers = {
        "@type": "Offer",
        price,
        priceCurrency: "RSD",
        availability: AVAILABILITY[product.stockStatus],
        itemCondition: "https://schema.org/NewCondition",
        url,
        seller: { "@type": "Organization", name: BRAND },
        // Only when a sale actually has an end date — never invented.
        ...(onSale && product.saleEndsAt ? { priceValidUntil: product.saleEndsAt.slice(0, 10) } : {}),
      };
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url,
    ...(description ? { description: description.slice(0, 5000) } : {}),
    ...(images.length ? { image: images } : {}),
    ...(product.__typename === "SimpleProduct" && product.sku ? { sku: product.sku } : {}),
    ...(category ? { category } : {}),
    brand: { "@type": "Brand", name: BRAND },
    ...(offers ? { offers } : {}),
    // No aggregateRating/review: the store has no real reviews.
  };
}
