/** Pages measured before/after — keep identical across runs. */
export const PAGES = [
  { id: "home", path: "/" },
  { id: "category", path: "/kategorija/ulozak-za-poliranje" },
  { id: "product-simple", path: "/proizvod/onyx-evo-clear-ppf-zastitna-folija" },
  { id: "cart", path: "/korpa" },
  { id: "en-home", path: "/en" },
  { id: "en-category", path: "/en/category/ulozak-za-poliranje" },
  { id: "de-product", path: "/de/produkt/onyx-peskir-za-susenje-auta-onyx-evolution-rapid-dryer" },
] as const;

export const BASE_URL = process.env.MEASURE_BASE_URL ?? "http://localhost:3000";
