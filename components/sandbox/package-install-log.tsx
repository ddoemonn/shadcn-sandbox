"use client";

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { PackageInstallEvent } from "@/lib/sandbox/types";
import { sandboxPanelClassName } from "@/lib/sandbox/utils";
import { cn } from "@/lib/utils";
import { SandboxPanelHeader } from "./panel-chrome";

interface PackageInstallLogProps {
  events: PackageInstallEvent[];
  isRunning?: boolean;
  className?: string;
}

function StatusIcon({ status }: { status: PackageInstallEvent["status"] }) {
  if (status === "pending") {
    return <Spinner className="size-3" />;
  }
  if (status === "success") {
    return <Check className="size-3 text-emerald-400/90" aria-hidden="true" />;
  }
  return <X className="size-3 text-red-400/90" aria-hidden="true" />;
}

export function PackageInstallLog({
  events,
  isRunning = false,
  className,
}: PackageInstallLogProps) {
  return (
    <div className={sandboxPanelClassName(className)}>
      <SandboxPanelHeader title="Terminal">
        {isRunning ? (
          <Badge
            variant="secondary"
            className="h-5 gap-1 px-1.5 font-normal text-[10px]"
            aria-live="polite"
          >
            <Spinner className="size-3" />
            Installing
          </Badge>
        ) : null}
      </SandboxPanelHeader>
      <div
        className="flex flex-col gap-0.5 bg-sandbox-console-bg px-3 py-1.5 font-mono text-[11px] leading-5"
        translate="no"
        role="log"
        aria-live="polite"
      >
        {events.length === 0 ? (
          <p className="text-muted-foreground/60">
            <span className="text-emerald-400/80">$</span> npm install —
            waiting…
          </p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <StatusIcon status={event.status} />
                <span className="text-emerald-400/80">$</span>
                <span className="text-foreground/90">
                  npm install {event.name}@{event.version}
                </span>
              </div>
              {event.output ? (
                <p
                  className={cn(
                    "pl-5",
                    event.status === "error"
                      ? "text-red-400/90"
                      : "text-muted-foreground/70"
                  )}
                >
                  {event.output}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
