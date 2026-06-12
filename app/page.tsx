"use client";

import { ArrowRight, Code2, Eye, TerminalSquare } from "lucide-react";
import Link from "next/link";
import { CopyCommand } from "@/components/marketing/copy-command";
import { SandboxIDE } from "@/components/sandbox/sandbox-ide";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SandboxProvider } from "@/lib/sandbox/sandbox-store";
import { sandboxShellClassName } from "@/lib/sandbox/utils";

const installCommands = [
  "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/code-editor.json",
  "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/preview-frame.json",
  "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/resizable-ide-layout.json",
];

const features = [
  {
    icon: Code2,
    title: "Multi-file CodeEditor",
    description:
      "Tabs, syntax highlighting, dirty state, format and copy actions — ready to drop into docs or dashboards.",
  },
  {
    icon: Eye,
    title: "Live PreviewFrame",
    description:
      "Responsive viewport switching, refresh controls, loading and error states with a polished runtime overlay.",
  },
  {
    icon: TerminalSquare,
    title: "Console & Install Logs",
    description:
      "Developer-grade console panel and terminal-style package install output for realistic playground UX.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-border border-b">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent_45%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex rounded-full border border-border bg-muted/30 px-3 py-1 text-muted-foreground text-xs">
              Open-source playground primitives for shadcn/ui
            </p>
            <h1 className="text-balance font-semibold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Interactive code playground components for shadcn/ui
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Build embedded editors, live previews, file trees, consoles, and
              error overlays with copy-pasteable shadcn components.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                render={<Link href="/playground" />}
                nativeButton={false}
              >
                Get Started
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/components" />}
                nativeButton={false}
              >
                View Components
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-6xl">
            <div
              className={sandboxShellClassName(
                "p-1.5 shadow-2xl shadow-black/30"
              )}
            >
              <SandboxProvider readOnly={true}>
                <SandboxIDE className="h-[680px] border-0 shadow-none ring-0" />
              </SandboxProvider>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} size="sm">
              <CardHeader>
                <feature.icon
                  className="text-muted-foreground"
                  aria-hidden="true"
                />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="border-border border-t bg-muted/10"
        aria-labelledby="install-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Card className="border-none bg-transparent shadow-none ring-0">
            <CardHeader>
              <CardTitle id="install-heading">
                Install from the registry
              </CardTitle>
              <CardDescription>
                Add individual playground components to your project with the
                shadcn CLI.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {installCommands.map((command) => (
                <CopyCommand key={command} command={command} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
