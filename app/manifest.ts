import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} - shadcn/ui playground components`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#252525",
    categories: ["developer tools", "productivity"],
  };
}
