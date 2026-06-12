import type { Metadata } from "next";
import { componentDocs } from "@/lib/component-docs/registry";

export const siteUrl = "https://shadcn-sandbox.vercel.app";
export const siteName = "shadcn-sandbox";
export const siteDescription =
  "Open-source shadcn/ui playground components for embedded code editors, live previews, file trees, consoles, install logs, and runtime error overlays.";

export const seoKeywords = [
  "shadcn/ui",
  "shadcn registry",
  "React code editor",
  "Next.js playground",
  "CodeMirror React",
  "developer tools",
  "component registry",
  "Tailwind CSS components",
  "live preview component",
  "open-source UI components",
];

export const baseOpenGraphImages = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "shadcn-sandbox interactive playground component preview",
  },
];

export function createCanonicalUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description = siteDescription,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = createCanonicalUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      images: baseOpenGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image"],
    },
  };
}

export const componentSitemapEntries = componentDocs.map((component) => ({
  path: `/components/${component.slug}`,
  title: component.title,
  description: component.description,
}));
