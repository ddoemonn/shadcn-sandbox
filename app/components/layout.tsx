import type { Metadata } from "next";
import { ComponentsSidebar } from "@/components/marketing/components-sidebar";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Components",
  description:
    "Browse installable shadcn/ui playground primitives for code editors, previews, file trees, consoles, install logs, and error overlays.",
  path: "/components",
});

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <ComponentsSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
