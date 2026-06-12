import Link from "next/link";
import { componentDocs } from "@/lib/component-docs/registry";

export default function ComponentsIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="text-balance font-semibold text-3xl tracking-tight">
          Components
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground text-sm">
          Reusable playground primitives with live previews, Shiki source
          highlighting, and registry install commands.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {componentDocs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/components/${doc.slug}`}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/20"
          >
            <h2 className="font-semibold text-sm">{doc.title}</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              {doc.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
