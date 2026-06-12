"use client";

import { Blocks, GitBranch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/playground", label: "Playground" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-border border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/40">
            <Blocks aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm tracking-tight">
              shadcn-sandbox
            </p>
            <p className="text-[11px] text-muted-foreground">
              Playground components
            </p>
          </div>
        </Link>
        <nav
          className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Main"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            render={
              <a
                href="https://github.com/ddoemonn/shadcn-sandbox"
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub"
              >
                GitHub
              </a>
            }
            nativeButton={false}
          >
            <GitBranch data-icon="inline-start" aria-hidden="true" />
            GitHub
          </Button>
          <Button
            size="sm"
            render={<Link href="/playground" />}
            nativeButton={false}
          >
            Open Playground
          </Button>
        </div>
      </div>
    </header>
  );
}
