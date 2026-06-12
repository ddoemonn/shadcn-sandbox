"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { BashCode } from "@/components/marketing/bash-code";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyCommandProps {
  command: string;
  className?: string;
}

export function CopyCommand({ command, className }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2",
        className
      )}
    >
      <BashCode code={command} truncate={true} className="min-w-0 flex-1" />
      <Button
        variant="ghost"
        size="xs"
        onClick={handleCopy}
        aria-label={copied ? "Command copied" : "Copy install command"}
      >
        {copied ? (
          <Check data-icon="inline-start" />
        ) : (
          <Copy data-icon="inline-start" />
        )}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </Button>
    </div>
  );
}
