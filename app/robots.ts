import type { MetadataRoute } from "next";
import { createCanonicalUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/_next/", "/api/"],
    },
    sitemap: createCanonicalUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
