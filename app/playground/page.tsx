"use client";

import { Play } from "lucide-react";
import { PackageInstallLog } from "@/components/sandbox/package-install-log";
import { SandboxIDE } from "@/components/sandbox/sandbox-ide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SandboxProvider, useSandbox } from "@/lib/sandbox/sandbox-store";

function PlaygroundToolbar() {
  const sandbox = useSandbox();

  return (
    <div className="flex items-center justify-between border-border border-b bg-muted/10 px-4 py-2">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="font-mono text-[10px]">
          counter-demo
        </Badge>
        <span className="text-muted-foreground text-xs tabular-nums">
          {sandbox.files.length} files
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-[10px] capitalize">
          {sandbox.previewStatus}
        </Badge>
        <Button
          size="sm"
          onClick={sandbox.runPreview}
          disabled={sandbox.isRunning}
        >
          {sandbox.isRunning ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Play data-icon="inline-start" />
          )}
          Run
        </Button>
      </div>
    </div>
  );
}

function PlaygroundContent() {
  const sandbox = useSandbox();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <PlaygroundToolbar />
      <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto]">
        <div className="min-h-0 p-3">
          <SandboxIDE
            className="h-full min-h-0 border-0 ring-0"
            defaultConsoleSize={24}
          />
        </div>
        <div className="border-border border-t px-3 pb-3">
          <PackageInstallLog
            events={sandbox.installEvents}
            isRunning={sandbox.isRunning}
          />
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <SandboxProvider>
      <h1 className="sr-only">Playground</h1>
      <PlaygroundContent />
    </SandboxProvider>
  );
}
