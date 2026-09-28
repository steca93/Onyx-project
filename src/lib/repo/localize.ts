import type { CatalogTranslations } from "@/i18n/catalog";
import type {
  AnyProduct,
  ProductCategory,
  ProductCategoryRef,
  ProductImage,
  ProductListResult,
  SearchIndexProduct,
} from "./types";

type Catalog = CatalogTranslations;

function term(catalog: Catalog, value: string): string {
  return catalog.terms[value] ?? value;
}

/** Product photos' alt text is the (Serbian) product name in practice —
 * swap in the translated name so screen readers get the visitor's language. */
function localizeImage(image: ProductImage | null, name: string | undefined): ProductImage | null {
  if (!image || !name) return image;
  return { ...image, altText: name };
}

function localizeCategoryRef(catalog: Catalog, ref: ProductCategoryRef): ProductCategoryRef {
  return { ...ref, name: catalog.categories[ref.slug]?.name ?? ref.name };
}

export function localizeCategory(catalog: Catalog, category: ProductCategory): ProductCategory {
  const t = catalog.categories[category.slug];
  const name = t?.name ?? category.name;
  return {
    ...category,
    name,
    description: t?.description ?? category.description,
    image: category.image && t?.name ? { ...category.image, altText: name } : category.image,
    ...(category.parent ? { parent: localizeCategoryRef(catalog, category.parent) } : {}),
    ...(category.children
      ? { children: category.children.map((c) => ({ ...c, ...localizeCategoryRef(catalog, c) })) }
      : {}),
  };
}

export function localizeProduct(catalog: Catalog, product: AnyProduct): AnyProduct {
  const t = catalog.products[product.slug] ?? {};
  const base = {
    ...product,
    name: t.name ?? product.name,
    shortDescription: t.shortDescription ?? product.shortDescription,
    description: t.description ?? product.description,
    image: localizeImage(product.image, t.name),
    galleryImages: {
      nodes: product.galleryImages.nodes.map((img) => localizeImage(img, t.name)!),
    },
    productCategories: {
      nodes: product.productCategories.nodes.map((c) => localizeCategoryRef(catalog, c)),
    },
    specs: product.specs.map((s) => ({
      label: term(catalog, s.label),
      // Spec values are comma-joined option lists (see live/mappers.ts).
      value: s.value
        .split(", ")
        .map((v) => term(catalog, v))
        .join(", "),
    })),
  };

  if (product.__typename === "VariableProduct") {
    // Only labels/display values are translated — `options` and variation
    // attribute `value`s are what the Store API matches on, so they stay raw
    // and the translated text goes in `optionLabels` for VariantSelector.
    return {
      ...(base as typeof product),
      attributes: {
        nodes: product.attributes.nodes.map((a) => ({
          ...a,
          label: term(catalog, a.label),
          optionLabels: Object.fromEntries(a.options.map((o) => [o, term(catalog, o)])),
        })),
      },
    };
  }
  return base as AnyProduct;
}

export function localizeListResult(catalog: Catalog, result: ProductListResult): ProductListResult {
  return {
    ...result,
    products: result.products.map((p) => localizeProduct(catalog, p)),
    category: result.category ? localizeCategory(catalog, result.category) : null,
  };
}

export function localizeSearchIndexItem(
  catalog: Catalog,
  item: SearchIndexProduct,
): SearchIndexProduct {
  const name = catalog.products[item.slug]?.name;
  return name ? { ...item, name, image: localizeImage(item.image, name) } : item;
}

/** Case- and diacritic-insensitive — "sundjer" should match "Sunđer",
 * "grosse" should match "Größe" closely enough for a storefront search. */
export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/đ/g, "dj")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
