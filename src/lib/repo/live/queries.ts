/**
 * Two different GraphQL shapes are in play here, and they are NOT
 * interchangeable:
 *
 * - `products(...)` connection nodes are typed as the `Product` INTERFACE —
 *   shared fields (id, name, image, productCategories, ...) can be queried
 *   directly, with `... on SimpleProduct` / `... on VariableProduct` only
 *   needed for type-specific fields (price, attributes, variations).
 * - the singular `product(id, idType)` field returns `ProductUnion` — a
 *   GraphQL UNION, which has no shared fields at all. Every field, shared
 *   or not, must live inside a per-type inline fragment there.
 *
 * SHARED_FIELDS/SIMPLE_FIELDS/VARIABLE_FIELDS get composed differently for
 * each case below — this was verified against the live schema, not guessed.
 */

const SHARED_FIELDS = /* GraphQL */ `
  id
  databaseId
  name
  slug
  description
  shortDescription
  date
  image {
    sourceUrl
    altText
  }
  galleryImages {
    nodes {
      sourceUrl
      altText
    }
  }
  productCategories {
    nodes {
      id
      name
      slug
    }
  }
`;

const SIMPLE_ONLY_FIELDS = /* GraphQL */ `
  price(format: RAW)
  regularPrice(format: RAW)
  salePrice(format: RAW)
  stockStatus
  sku
  featured
  attributes {
    nodes {
      name
      label
      options
      variation
    }
  }
`;

const VARIABLE_ONLY_FIELDS = /* GraphQL */ `
  price(format: RAW)
  regularPrice(format: RAW)
  salePrice(format: RAW)
  stockStatus
  featured
  attributes {
    nodes {
      name
      label
      options
      variation
    }
  }
  variations(first: 50) {
    nodes {
      id
      databaseId
      sku
      price(format: RAW)
      regularPrice(format: RAW)
      salePrice(format: RAW)
      stockStatus
      image {
        sourceUrl
        altText
      }
      attributes {
        nodes {
          name
          value
        }
      }
    }
  }
`;

/** For the `products(...)` connection — nodes are the `Product` interface. */
const INTERFACE_PRODUCT_FIELDS = /* GraphQL */ `
  ${SHARED_FIELDS}
  __typename
  ... on SimpleProduct {
    ${SIMPLE_ONLY_FIELDS}
  }
  ... on VariableProduct {
    ${VARIABLE_ONLY_FIELDS}
  }
`;

/**
 * For the singular `product(...)` field AND `related(...)` — both are
 * `ProductUnion`, not the `Product` interface, so every field (shared or
 * not) must be duplicated inside each type's inline fragment. No `related`
 * field here to avoid infinite nesting; the query below adds it one level
 * up for the top-level product only.
 */
const UNION_PRODUCT_FIELDS_NO_RELATED = /* GraphQL */ `
  __typename
  ... on SimpleProduct {
    ${SHARED_FIELDS}
    ${SIMPLE_ONLY_FIELDS}
  }
  ... on VariableProduct {
    ${SHARED_FIELDS}
    ${VARIABLE_ONLY_FIELDS}
  }
`;

const UNION_PRODUCT_FIELDS = /* GraphQL */ `
  __typename
  ... on SimpleProduct {
    ${SHARED_FIELDS}
    ${SIMPLE_ONLY_FIELDS}
    related(first: 4) {
      nodes {
        ${UNION_PRODUCT_FIELDS_NO_RELATED}
      }
    }
  }
  ... on VariableProduct {
    ${SHARED_FIELDS}
    ${VARIABLE_ONLY_FIELDS}
    related(first: 4) {
      nodes {
        ${UNION_PRODUCT_FIELDS_NO_RELATED}
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $where: RootQueryToProductConnectionWhereArgs) {
    products(first: $first, where: $where) {
      nodes {
        ${INTERFACE_PRODUCT_FIELDS}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const PRODUCT_BY_SLUG_QUERY = /* GraphQL */ `
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      ${UNION_PRODUCT_FIELDS}
    }
  }
`;

export const ALL_PRODUCT_SLUGS_QUERY = /* GraphQL */ `
  query AllProductSlugs($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Minimal fields for the header's live search index — id/name/slug/image
// plus price (needs a per-type inline fragment, same reason as PRODUCTS_QUERY
// above). Paginated the same way as ALL_PRODUCT_SLUGS_QUERY.
export const SEARCH_INDEX_QUERY = /* GraphQL */ `
  query SearchIndex($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        id
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price(format: RAW)
        }
        ... on VariableProduct {
          price(format: RAW)
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CATEGORIES_QUERY = /* GraphQL */ `
  query Categories($first: Int!) {
    productCategories(first: $first, where: { hideEmpty: false }) {
      nodes {
        id
        name
        slug
        count
        description
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const CATEGORY_BY_SLUG_QUERY = /* GraphQL */ `
  query CategoryBySlug($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      description
      image {
        sourceUrl
        altText
      }
    }
  }
`;
