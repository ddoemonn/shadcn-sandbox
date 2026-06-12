import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Playground",
  description:
    "Try the shadcn-sandbox IDE layout with a multi-file editor, live preview, file explorer, console panel, and simulated install logs.",
  path: "/playground",
});

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
