import type { MetadataRoute } from "next";
import { getAllCategories, getAllProductSlugs } from "@/lib/repo";

const SITE_URL = "https://onyxevolution.rs";

const STATIC_ROUTES = [
  "",
  "/korpa",
  "/garancija",
  "/ovlasceni-centri",
  "/postani-instalater",
  "/dostava-i-povracaj",
  "/uputstva-za-montazu",
  "/cesta-pitanja",
  "/kontakt",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categories] = await Promise.all([
    getAllProductSlugs(),
    getAllCategories(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/kategorija/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/proizvod/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
