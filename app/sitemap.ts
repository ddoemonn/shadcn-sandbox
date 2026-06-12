import type { MetadataRoute } from "next";
import { componentSitemapEntries, createCanonicalUrl } from "@/lib/seo";

const lastModified = new Date("2026-06-12T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: createCanonicalUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: createCanonicalUrl("/components"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: createCanonicalUrl("/playground"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...componentSitemapEntries.map((entry) => ({
      url: createCanonicalUrl(entry.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
