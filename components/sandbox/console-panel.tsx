"use client";

import { ChevronDown, ChevronUp, Terminal, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { ConsoleMessage } from "@/lib/sandbox/types";
import { formatTimestamp, sandboxPanelClassName } from "@/lib/sandbox/utils";
import { cn } from "@/lib/utils";
import { SandboxPanelHeader } from "./panel-chrome";

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

const levelTone: Record<ConsoleMessage["level"], string> = {
  log: "text-muted-foreground",
  info: "text-sky-400/90",
  warn: "text-amber-400/90",
  error: "text-red-400/90",
};

export function ConsolePanel({
  messages,
  onClear,
  collapsed = false,
  onCollapsedChange,
  className,
}: ConsolePanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (collapsed) {
      return;
    }

    const messageCount = messages.length;

    if (prevMessageCountRef.current === null) {
      prevMessageCountRef.current = messageCount;
      return;
    }

    if (messageCount <= prevMessageCountRef.current) {
      prevMessageCountRef.current = messageCount;
      return;
    }

    prevMessageCountRef.current = messageCount;

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [messages, collapsed]);

  return (
    <div className={cn(sandboxPanelClassName(className), "h-full")}>
      <SandboxPanelHeader title="Console" icon={Terminal}>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums">
            {messages.length}
          </span>
          {onClear ? (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 px-1.5 text-[10px]"
              onClick={onClear}
            >
              <Trash2
                data-icon="inline-start"
                className="size-3"
                aria-hidden="true"
              />
              Clear
            </Button>
          ) : null}
          {onCollapsedChange ? (
            collapsed ? (
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-6"
                onClick={() => onCollapsedChange(false)}
                aria-label="Expand console"
                aria-expanded={false}
              >
                <ChevronUp className="size-3.5" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-6"
                onClick={() => onCollapsedChange(true)}
                aria-label="Collapse console"
                aria-expanded={true}
              >
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </Button>
            )
          ) : null}
        </div>
      </SandboxPanelHeader>

      {!collapsed ? (
        <div
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-sandbox-console-bg px-3 py-1 font-mono text-[11px] leading-5"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          translate="no"
        >
          {messages.length === 0 ? (
            <p className="py-2 text-muted-foreground/60">No output</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="flex min-w-0 items-start gap-2 py-0.5"
              >
                <span className="shrink-0 text-muted-foreground/50 tabular-nums">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.source ? (
                  <span className={cn("shrink-0", levelTone[message.level])}>
                    [{message.source}]
                  </span>
                ) : null}
                <span
                  className={cn("min-w-0 break-all", levelTone[message.level])}
                >
                  {message.message}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
