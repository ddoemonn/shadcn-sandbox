"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyCommand } from "./copy-command";

interface ComponentDocPanelProps {
  usageHtml: string;
  installHtml: string;
  installCommand: string;
  demo: React.ReactNode;
}

const codePanelClassName =
  "shiki-code-block code-panel-block min-h-[240px] [&_.shiki]:bg-transparent [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed [&_code]:font-mono [&_code]:text-xs [&_code]:leading-relaxed";

export function ComponentDocPanel({
  usageHtml,
  installHtml,
  installCommand,
  demo,
}: ComponentDocPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <CopyCommand command={installCommand} />

      <div className="flex flex-col overflow-hidden rounded-xl border border-border">
        <div className="border-border/60 border-b bg-sandbox-gutter px-3 py-1.5">
          <p className="font-medium text-[11px] text-muted-foreground">
            Preview
          </p>
        </div>
        <div className="overflow-auto bg-muted/10 p-4">{demo}</div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-sandbox-editor-bg">
        <Tabs defaultValue="usage" className="flex flex-col">
          <div className="flex items-center justify-between gap-3 border-border/60 border-b bg-sandbox-gutter px-3 py-2">
            <TabsList variant="line" className="h-7">
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="install">Install</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="usage" className="mt-0 overflow-auto">
            <div
              className={codePanelClassName}
              translate="no"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki renders static local snippets to escaped HTML before this component receives them.
              dangerouslySetInnerHTML={{ __html: usageHtml }}
            />
          </TabsContent>

          <TabsContent value="install" className="mt-0 overflow-auto">
            <div
              className={codePanelClassName}
              translate="no"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: The bash highlighter escapes static command text before wrapping it in spans.
              dangerouslySetInnerHTML={{ __html: installHtml }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
