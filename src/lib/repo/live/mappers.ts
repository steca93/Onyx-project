import type {
  AnyProduct,
  ProductAttribute,
  ProductCategory,
  ProductImage,
  ProductSpec,
  StockStatus,
} from "../types";

const NEW_ARRIVAL_WINDOW_DAYS = 30;

interface RawImage {
  sourceUrl: string;
  altText: string | null;
}

interface RawAttribute {
  name: string;
  label: string;
  options: string[];
  variation: boolean;
}

interface RawVariation {
  id: string;
  databaseId: number;
  sku: string | null;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: StockStatus;
  image: RawImage | null;
  attributes: { nodes: { name: string; value: string }[] };
}

export interface RawProductNode {
  __typename: "SimpleProduct" | "VariableProduct" | string;
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  /** Absent on listing (card) queries — only the PDP query selects it. */
  description?: string | null;
  shortDescription?: string | null;
  date: string | null;
  image: RawImage | null;
  galleryImages?: { nodes: RawImage[] };
  productCategories: { nodes: { id: string; name: string; slug: string }[] };
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockStatus?: StockStatus;
  sku?: string | null;
  featured?: boolean | null;
  dateOnSaleTo?: string | null;
  attributes?: { nodes: RawAttribute[] };
  variations?: { nodes: RawVariation[] };
  related?: { nodes: RawProductNode[] };
}

/** WordPress alt text is often empty — fall back to the product/category
 * name so every image has a meaningful alt. */
function image(raw: RawImage | null, fallbackAlt = ""): ProductImage | null {
  if (!raw) return null;
  return { sourceUrl: raw.sourceUrl, altText: raw.altText?.trim() || fallbackAlt };
}

function isNewArrival(dateString: string | null): boolean {
  if (!dateString) return false;
  const published = new Date(dateString).getTime();
  if (Number.isNaN(published)) return false;
  const ageDays = (Date.now() - published) / (1000 * 60 * 60 * 24);
  return ageDays <= NEW_ARRIVAL_WINDOW_DAYS;
}

/** Non-variation attributes double as the mono spec list on the PDP. */
function specsFromAttributes(attributes: RawAttribute[] | undefined): ProductSpec[] {
  if (!attributes) return [];
  return attributes
    .filter((a) => !a.variation)
    .map((a) => ({ label: a.label, value: a.options.join(", ") }));
}

function variantAttributes(attributes: RawAttribute[] | undefined): ProductAttribute[] {
  if (!attributes) return [];
  return attributes
    .filter((a) => a.variation)
    .map((a) => ({ name: a.name, label: a.label, options: a.options }));
}

export function mapProduct(raw: RawProductNode): AnyProduct | null {
  const base = {
    id: raw.id,
    databaseId: raw.databaseId,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
    shortDescription: raw.shortDescription ?? null,
    image: image(raw.image, raw.name),
    galleryImages: {
      nodes: (raw.galleryImages?.nodes ?? []).map((n, i) => image(n, `${raw.name} (${i + 2})`)!).filter(Boolean),
    },
    productCategories: { nodes: raw.productCategories.nodes },
    specs: specsFromAttributes(raw.attributes?.nodes),
    // No custom-field convention exists on the live backend yet for these —
    // honest null rather than inventing copy that isn't really there.
    installationNotes: null,
    warrantyNotes: null,
    featured: Boolean(raw.featured),
    newArrival: isNewArrival(raw.date),
    saleEndsAt: raw.dateOnSaleTo ?? null,
  };

  if (raw.__typename === "SimpleProduct") {
    return {
      ...base,
      __typename: "SimpleProduct",
      price: raw.price ?? null,
      regularPrice: raw.regularPrice ?? null,
      salePrice: raw.salePrice ?? null,
      stockStatus: raw.stockStatus ?? "IN_STOCK",
      sku: raw.sku ?? null,
    };
  }

  if (raw.__typename === "VariableProduct") {
    return {
      ...base,
      __typename: "VariableProduct",
      price: raw.price ?? null,
      regularPrice: raw.regularPrice ?? null,
      salePrice: raw.salePrice ?? null,
      stockStatus: raw.stockStatus ?? "IN_STOCK",
      attributes: { nodes: variantAttributes(raw.attributes?.nodes) },
      variations: {
        nodes: (raw.variations?.nodes ?? []).map((v) => ({
          id: v.id,
          databaseId: v.databaseId,
          sku: v.sku,
          price: v.price,
          regularPrice: v.regularPrice,
          salePrice: v.salePrice,
          stockStatus: v.stockStatus,
          image: image(v.image, raw.name),
          attributes: v.attributes.nodes,
        })),
      },
    };
  }

  // ExternalProduct / GroupProduct are out of scope for this storefront.
  return null;
}

export function mapProducts(nodes: RawProductNode[]): AnyProduct[] {
  return nodes.map(mapProduct).filter((p): p is AnyProduct => p !== null);
}

export interface RawCategoryNode {
  id: string;
  name: string;
  slug: string;
  count: number | null;
  description: string | null;
  image: RawImage | null;
  parent?: { node: { name: string; slug: string } | null } | null;
  children?: { nodes: { name: string; slug: string; count: number | null }[] };
}

export function mapCategory(raw: RawCategoryNode): ProductCategory {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    count: raw.count,
    description: raw.description,
    image: image(raw.image, raw.name),
    ...(raw.parent !== undefined ? { parent: raw.parent?.node ?? null } : {}),
    ...(raw.children ? { children: raw.children.nodes } : {}),
  };
}
