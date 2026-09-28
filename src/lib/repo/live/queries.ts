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
 * The field sets below get composed differently for each case — this was
 * verified against the live schema, not guessed.
 */

/** Fields every product view needs — name, price, one image, categories. */
const CARD_SHARED_FIELDS = /* GraphQL */ `
  id
  databaseId
  name
  slug
  date
  image {
    sourceUrl
    altText
  }
  productCategories {
    nodes {
      id
      name
      slug
    }
  }
`;

const CARD_TYPE_FIELDS = /* GraphQL */ `
  price(format: RAW)
  regularPrice(format: RAW)
  salePrice(format: RAW)
  stockStatus
  featured
`;

/** Extra fields only the product detail page renders. */
const DETAIL_SHARED_FIELDS = /* GraphQL */ `
  description
  shortDescription
  galleryImages {
    nodes {
      sourceUrl
      altText
    }
  }
`;

const ATTRIBUTE_FIELDS = /* GraphQL */ `
  attributes {
    nodes {
      name
      label
      options
      variation
    }
  }
`;

const DETAIL_SIMPLE_FIELDS = /* GraphQL */ `
  sku
  ${ATTRIBUTE_FIELDS}
`;

const DETAIL_VARIABLE_FIELDS = /* GraphQL */ `
  ${ATTRIBUTE_FIELDS}
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

/**
 * Listing cards, for the `products(...)` connection — nodes are the
 * `Product` interface, so shared fields sit at the top level. No
 * descriptions, galleries, attributes or variations: cards don't render
 * them, and they made up most of each listing response's size.
 */
const CARD_PRODUCT_FIELDS = /* GraphQL */ `
  __typename
  ${CARD_SHARED_FIELDS}
  ... on SimpleProduct {
    ${CARD_TYPE_FIELDS}
  }
  ... on VariableProduct {
    ${CARD_TYPE_FIELDS}
  }
`;

/**
 * The singular `product(...)` field and `related(...)` are `ProductUnion`,
 * not the `Product` interface — every field, shared or not, must be
 * repeated inside each type's inline fragment. Related products are cards.
 */
const UNION_CARD_FIELDS = /* GraphQL */ `
  __typename
  ... on SimpleProduct {
    ${CARD_SHARED_FIELDS}
    ${CARD_TYPE_FIELDS}
  }
  ... on VariableProduct {
    ${CARD_SHARED_FIELDS}
    ${CARD_TYPE_FIELDS}
  }
`;

const UNION_DETAIL_FIELDS = /* GraphQL */ `
  __typename
  ... on SimpleProduct {
    ${CARD_SHARED_FIELDS}
    ${DETAIL_SHARED_FIELDS}
    ${CARD_TYPE_FIELDS}
    ${DETAIL_SIMPLE_FIELDS}
    related(first: 4) {
      nodes {
        ${UNION_CARD_FIELDS}
      }
    }
  }
  ... on VariableProduct {
    ${CARD_SHARED_FIELDS}
    ${DETAIL_SHARED_FIELDS}
    ${CARD_TYPE_FIELDS}
    ${DETAIL_VARIABLE_FIELDS}
    related(first: 4) {
      nodes {
        ${UNION_CARD_FIELDS}
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $where: RootQueryToProductConnectionWhereArgs) {
    products(first: $first, where: $where) {
      nodes {
        ${CARD_PRODUCT_FIELDS}
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
      ${UNION_DETAIL_FIELDS}
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
