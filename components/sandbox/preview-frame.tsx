"use client";

import {
  AlertCircle,
  ExternalLink,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  PreviewStatus,
  RuntimeError,
  ViewportSize,
} from "@/lib/sandbox/types";
import { getViewportWidth, sandboxPanelClassName } from "@/lib/sandbox/utils";
import { cn } from "@/lib/utils";
import { ErrorOverlay } from "./error-overlay";
import { SandboxPanelHeader } from "./panel-chrome";

interface PreviewFrameProps {
  status: PreviewStatus;
  viewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
  srcDoc: string;
  runtimeError?: RuntimeError | null;
  onRefresh?: () => void;
  onOpenInNewTab?: () => void;
  onOpenErrorFile?: () => void;
  onDismissError?: () => void;
  className?: string;
}

const viewportOptions: {
  value: ViewportSize;
  label: string;
  icon: typeof Monitor;
}[] = [
  { value: "desktop", label: "Desktop viewport", icon: Monitor },
  { value: "tablet", label: "Tablet viewport", icon: Tablet },
  { value: "mobile", label: "Mobile viewport", icon: Smartphone },
];

export function PreviewFrame({
  status,
  viewport,
  onViewportChange,
  srcDoc,
  runtimeError,
  onRefresh,
  onOpenInNewTab,
  onOpenErrorFile,
  onDismissError,
  className,
}: PreviewFrameProps) {
  return (
    <div className={cn(sandboxPanelClassName(className), "h-full")}>
      <SandboxPanelHeader title="Preview">
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <Badge
              variant="secondary"
              className="gap-1 font-normal"
              aria-live="polite"
            >
              <Spinner />
              Building
            </Badge>
          ) : null}
          {status === "error" ? (
            <Badge variant="destructive" className="gap-1 font-normal">
              <AlertCircle aria-hidden="true" />
              Error
            </Badge>
          ) : null}
          <ToggleGroup
            value={[viewport]}
            onValueChange={(values) => {
              const next = values[0] as ViewportSize | undefined;
              if (next) {
                onViewportChange(next);
              }
            }}
            variant="outline"
            size="sm"
            spacing={0}
            aria-label="Preview viewport"
          >
            {viewportOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem key={value} value={value} aria-label={label}>
                <Icon aria-hidden="true" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {onRefresh ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={onRefresh}
                    aria-label="Refresh preview"
                  />
                }
              >
                <RefreshCw aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Refresh preview</TooltipContent>
            </Tooltip>
          ) : null}
          {onOpenInNewTab ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={onOpenInNewTab}
                    aria-label="Open preview in new tab"
                  />
                }
              >
                <ExternalLink aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </SandboxPanelHeader>

      <div className="relative flex min-h-0 flex-1 items-start justify-center overflow-hidden bg-sandbox-panel/50 p-3 [background-image:radial-gradient(color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px)] [background-size:14px_14px]">
        {status === "loading" ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-muted-foreground text-xs">
                Rebuilding preview…
              </p>
            </div>
          </div>
        ) : null}

        {status === "error" && !runtimeError ? (
          <Empty className="border-none py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircle aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Preview failed to load</EmptyTitle>
              <EmptyDescription>
                Check the console for build errors and try running again.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div
            className={cn(
              "relative h-full max-h-full min-h-[240px] overflow-hidden rounded-lg border border-border bg-background shadow-xl transition-[width,transform,opacity] duration-300 motion-reduce:transition-none",
              viewport !== "desktop" && "mx-auto"
            )}
            style={{ width: getViewportWidth(viewport), maxWidth: "100%" }}
          >
            <iframe
              title="Live preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-same-origin"
              className="h-full w-full border-0 bg-background"
            />
            {runtimeError ? (
              <ErrorOverlay
                error={runtimeError}
                onOpenFile={onOpenErrorFile}
                onCopy={async () => {
                  const { formatRuntimeErrorForCopy } = await import(
                    "@/lib/sandbox/utils"
                  );
                  await navigator.clipboard.writeText(
                    formatRuntimeErrorForCopy(runtimeError)
                  );
                }}
                onDismiss={onDismissError}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
