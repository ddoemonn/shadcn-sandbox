import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-border border-t bg-muted/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-sm">shadcn-sandbox</p>
          <p className="text-muted-foreground text-xs">
            Copy-paste playground components for React and Next.js apps.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
          <Separator orientation="vertical" className="hidden h-4 md:block" />
          <Link href="/playground" className="hover:text-foreground">
            Playground
          </Link>
          <Separator orientation="vertical" className="hidden h-4 md:block" />
          <span>Registry-ready install commands included</span>
        </div>
      </div>
    </footer>
  );
}
