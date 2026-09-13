import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";
import { productRepository } from "@/lib/repositories/product-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await productRepository.getAllSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_CONFIG.url}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_CONFIG.url}/ambassadors`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_CONFIG.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_CONFIG.url}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_CONFIG.url}/products/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
