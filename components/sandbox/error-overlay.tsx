"use client";

import { Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ErrorOverlayProps {
  error: {
    title: string;
    message: string;
    stack: string;
    file: string;
    line: number;
    column?: number;
  };
  onOpenFile?: () => void;
  onCopy?: () => void | Promise<void>;
  onDismiss?: () => void;
}

export function ErrorOverlay({
  error,
  onOpenFile,
  onCopy,
  onDismiss,
}: ErrorOverlayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy?.();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-sandbox-editor-bg/98">
      <div className="flex shrink-0 items-start gap-3 border-red-500/30 border-b bg-red-500/10 px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[11px] text-red-300">{error.title}</p>
          <p className="mt-0.5 text-[11px] text-red-200/80">{error.message}</p>
        </div>
        {onDismiss ? (
          <Button
            variant="ghost"
            size="icon-xs"
            className="size-6 shrink-0 text-red-200/70 hover:text-red-100"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
        <p className="mb-2 font-mono text-[10px] text-muted-foreground">
          {error.file}:{error.line}
          {error.column ? `:${error.column}` : ""}
        </p>
        <pre
          className="whitespace-pre-wrap font-mono text-[11px] text-red-300/90 leading-5"
          translate="no"
        >
          {error.stack}
        </pre>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-border/60 border-t bg-sandbox-gutter px-3 py-1.5">
        {onOpenFile ? (
          <Button
            variant="ghost"
            size="xs"
            className="h-6 text-[10px]"
            onClick={onOpenFile}
          >
            <ExternalLink data-icon="inline-start" className="size-3" />
            Open File
          </Button>
        ) : null}
        {onCopy ? (
          <Button
            variant="ghost"
            size="xs"
            className="h-6 text-[10px]"
            onClick={handleCopy}
          >
            <Copy data-icon="inline-start" className="size-3" />
            {copied ? "Copied" : "Copy Error"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
