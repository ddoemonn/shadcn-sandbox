"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { sandboxShellClassName } from "@/lib/sandbox/utils";
import { cn } from "@/lib/utils";

interface ResizableIdeLayoutProps {
  fileTree: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
  console: ReactNode;
  className?: string;
  defaultConsoleSize?: number;
  consoleCollapsed?: boolean;
  onConsoleCollapsedChange?: (collapsed: boolean) => void;
}

interface ConsoleSlotProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

function panelShellClassName(className?: string) {
  return cn("h-full min-h-0 min-w-0 overflow-hidden", className);
}

const sidebarDefaultSize = "220px";
const sidebarMinSize = "180px";
const sidebarMaxSize = "360px";
const editorMinSize = "320px";
const previewMinSize = "240px";
const consoleHeaderHeight = 36;
const consoleMinHeight = 120;

export function ResizableIDELayout({
  fileTree,
  editor,
  preview,
  console,
  className,
  defaultConsoleSize = 24,
  consoleCollapsed: consoleCollapsedProp = false,
  onConsoleCollapsedChange,
}: ResizableIdeLayoutProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(180);

  const isControlled = onConsoleCollapsedChange !== undefined;
  const consoleCollapsed = isControlled
    ? consoleCollapsedProp
    : internalCollapsed;
  const setConsoleCollapsed = onConsoleCollapsedChange ?? setInternalCollapsed;

  const consoleSize = Math.min(Math.max(defaultConsoleSize, 16), 45);

  useLayoutEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return;
    }
    setConsoleHeight(
      Math.max(
        consoleMinHeight,
        Math.round(workspace.clientHeight * (consoleSize / 100))
      )
    );
  }, [consoleSize]);

  const handleConsoleCollapsedChange = useCallback(
    (nextCollapsed: boolean) => {
      setConsoleCollapsed(nextCollapsed);
    },
    [setConsoleCollapsed]
  );

  const getConsoleMaxHeight = useCallback(() => {
    const workspace = workspaceRef.current;
    return workspace ? Math.round(workspace.clientHeight * 0.45) : 320;
  }, []);

  const adjustConsoleHeight = useCallback(
    (delta: number) => {
      const maxHeight = getConsoleMaxHeight();
      setConsoleHeight((height) =>
        Math.min(maxHeight, Math.max(consoleMinHeight, height + delta))
      );
    },
    [getConsoleMaxHeight]
  );

  const startConsoleResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (consoleCollapsed) {
        return;
      }

      event.preventDefault();
      const startY = event.clientY;
      const startHeight = consoleHeight;
      const maxHeight = getConsoleMaxHeight();

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const nextHeight = startHeight + (startY - moveEvent.clientY);
        setConsoleHeight(
          Math.min(maxHeight, Math.max(consoleMinHeight, nextHeight))
        );
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [consoleCollapsed, consoleHeight, getConsoleMaxHeight]
  );

  const handleConsoleResizeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        adjustConsoleHeight(16);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        adjustConsoleHeight(-16);
      }
    },
    [adjustConsoleHeight]
  );

  const consoleSlot = isValidElement<ConsoleSlotProps>(console)
    ? cloneElement(console as ReactElement<ConsoleSlotProps>, {
        collapsed: consoleCollapsed,
        onCollapsedChange: handleConsoleCollapsedChange,
      })
    : console;

  return (
    <div
      className={cn(
        sandboxShellClassName(
          "flex h-[680px] flex-col shadow-2xl shadow-black/20"
        ),
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2 bg-sandbox-gutter px-2.5 py-1.5">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/20" />
        </div>
        <span className="ml-1 truncate font-mono text-[10px] text-muted-foreground">
          counter-demo
        </span>
      </div>

      <Separator />

      <div ref={workspaceRef} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-hidden">
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full min-h-0"
            resizeTargetMinimumSize={{ coarse: 24, fine: 10 }}
          >
            <ResizablePanel
              defaultSize={sidebarDefaultSize}
              minSize={sidebarMinSize}
              maxSize={sidebarMaxSize}
              groupResizeBehavior="preserve-pixel-size"
              id="ide-sidebar"
            >
              <div
                className={panelShellClassName(
                  "min-w-[180px] border-border/60 border-r bg-sandbox-sidebar"
                )}
              >
                {fileTree}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle={true} />

            <ResizablePanel
              defaultSize={38}
              minSize={editorMinSize}
              id="ide-editor"
            >
              <div
                className={panelShellClassName(
                  "border-border/60 border-r bg-sandbox-editor-bg"
                )}
              >
                {editor}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle={true} />

            <ResizablePanel
              defaultSize={42}
              minSize={previewMinSize}
              id="ide-preview"
            >
              <div className={panelShellClassName("bg-sandbox-panel")}>
                {preview}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {!consoleCollapsed ? (
          // biome-ignore lint/a11y/useSemanticElements: This is an interactive splitter with pointer and keyboard resizing, not a static thematic separator.
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize console"
            aria-valuemin={consoleMinHeight}
            aria-valuemax={getConsoleMaxHeight()}
            aria-valuenow={consoleHeight}
            tabIndex={0}
            className="flex h-2 shrink-0 cursor-row-resize touch-none select-none items-center justify-center border-border/60 border-t bg-sandbox-gutter hover:bg-border/20"
            onPointerDown={startConsoleResize}
            onKeyDown={handleConsoleResizeKeyDown}
          >
            <div className="h-0.5 w-10 rounded-full bg-border/80" />
          </div>
        ) : null}

        <div
          className={cn(
            "shrink-0 overflow-hidden bg-sandbox-console-bg",
            consoleCollapsed && "border-border/60 border-t"
          )}
          style={{
            height: consoleCollapsed ? consoleHeaderHeight : consoleHeight,
          }}
        >
          {consoleSlot}
        </div>
      </div>
    </div>
  );
}
