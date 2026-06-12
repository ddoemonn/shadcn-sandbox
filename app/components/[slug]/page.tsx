import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentDocPanel } from "@/components/marketing/component-doc-panel";
import { highlightBashToHtml } from "@/lib/bash-highlight";
import { componentDemos } from "@/lib/component-docs/demos";
import {
  getComponentDoc,
  getComponentSlugs,
} from "@/lib/component-docs/registry";
import { highlightCode } from "@/lib/shiki";

interface ComponentDocPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getComponentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ComponentDocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponentDoc(slug);

  if (!doc) {
    return { title: "Component" };
  }

  return {
    title: doc.title,
  };
}

export default async function ComponentDocPage({
  params,
}: ComponentDocPageProps) {
  const { slug } = await params;
  const doc = getComponentDoc(slug);

  if (!doc) {
    notFound();
  }

  const demo = componentDemos[slug];
  if (!demo) {
    notFound();
  }

  const usageHtml = await highlightCode(doc.usageCode, "tsx");
  const installHtml = highlightBashToHtml(doc.installCommand);

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <h1 className="text-balance font-semibold text-3xl tracking-tight">
          {doc.title}
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground text-sm">
          {doc.description}
        </p>
      </div>

      <ComponentDocPanel
        demo={demo}
        usageHtml={usageHtml}
        installHtml={installHtml}
        installCommand={doc.installCommand}
      />
    </div>
  );
}
