"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { componentDocs } from "@/lib/component-docs/registry";
import { cn } from "@/lib/utils";

export function ComponentsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block">
      <nav
        className="sticky top-20 flex flex-col gap-1"
        aria-label="Components"
      >
        <Link
          href="/components"
          aria-current={pathname === "/components" ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/components"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          )}
        >
          Overview
        </Link>
        {componentDocs.map((doc) => {
          const href = `/components/${doc.slug}`;
          const isActive = pathname === href;

          return (
            <Link
              key={doc.slug}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {doc.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
