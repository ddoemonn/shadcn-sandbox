"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/sandbox/code-editor";
import { ConsolePanel } from "@/components/sandbox/console-panel";
import { ErrorOverlay } from "@/components/sandbox/error-overlay";
import { FileTree } from "@/components/sandbox/file-tree";
import { PackageInstallLog } from "@/components/sandbox/package-install-log";
import { PreviewFrame } from "@/components/sandbox/preview-frame";
import { ResizableIDELayout } from "@/components/sandbox/resizable-ide-layout";
import { Button } from "@/components/ui/button";
import {
  buildPreviewSrcDoc,
  sampleConsoleMessages,
  sampleFiles,
  sampleFileTree,
  sampleInstallEvents,
  sampleRuntimeError,
} from "@/lib/sandbox/sample-files";
import { SandboxProvider, useSandbox } from "@/lib/sandbox/sandbox-store";
import {
  addFileToTree,
  formatCode,
  removeFileFromTree,
} from "@/lib/sandbox/utils";

export function CodeEditorDemo() {
  const [files, setFiles] = useState(sampleFiles);
  const [activeFileId, setActiveFileId] = useState(sampleFiles[0].id);

  return (
    <CodeEditor
      files={files}
      activeFileId={activeFileId}
      onActiveFileChange={setActiveFileId}
      onChange={(id, content) =>
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? {
                  ...file,
                  content,
                  isDirty:
                    content !== sampleFiles.find((f) => f.id === id)?.content,
                }
              : file
          )
        )
      }
      onFormat={() => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === activeFileId
              ? { ...file, content: formatCode(file.content) }
              : file
          )
        );
      }}
      className="h-[420px]"
    />
  );
}

export function PreviewFrameDemo() {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "ready"
  );
  const [showError, setShowError] = useState(false);

  return (
    <div className="flex h-[420px] flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setStatus("loading");
            window.setTimeout(() => setStatus("ready"), 800);
          }}
        >
          Simulate loading
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowError((value) => !value)}
        >
          Toggle error overlay
        </Button>
      </div>
      <PreviewFrame
        status={status}
        viewport={viewport}
        onViewportChange={setViewport}
        srcDoc={buildPreviewSrcDoc(3)}
        runtimeError={showError ? sampleRuntimeError : null}
        onRefresh={() => {
          setStatus("loading");
          window.setTimeout(() => setStatus("ready"), 600);
        }}
        onOpenInNewTab={() => window.open("about:blank")}
        onDismissError={() => setShowError(false)}
        className="min-h-0 flex-1"
      />
    </div>
  );
}

export function FileTreeDemo() {
  const [tree, setTree] = useState(sampleFileTree);
  const [activeFileId, setActiveFileId] = useState(sampleFiles[0].id);

  return (
    <FileTree
      tree={tree}
      activeFileId={activeFileId}
      onSelectFile={setActiveFileId}
      onCreateFile={() => {
        const id = `demo-file-${Date.now()}`;
        const file = {
          id,
          name: "demo.tsx",
          path: "components/demo.tsx",
          language: "tsx" as const,
          content: "export function Demo() { return null; }",
        };
        setTree((prev) => addFileToTree(prev, file));
      }}
      onDeleteFile={(fileId) => {
        setTree((prev) => removeFileFromTree(prev, fileId));
      }}
      className="h-[420px]"
    />
  );
}

export function ConsolePanelDemo() {
  const [messages, setMessages] = useState(sampleConsoleMessages);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConsolePanel
      messages={messages}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      onClear={() => setMessages([])}
    />
  );
}

export function PackageInstallLogDemo() {
  const [events, setEvents] = useState(sampleInstallEvents.slice(0, 1));
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="sm"
        onClick={async () => {
          setIsRunning(true);
          setEvents([
            {
              id: "demo-1",
              name: "tailwind-merge",
              version: "3.6.0",
              status: "pending",
            },
          ]);
          await new Promise((resolve) => window.setTimeout(resolve, 900));
          setEvents([
            {
              id: "demo-1",
              name: "tailwind-merge",
              version: "3.6.0",
              status: "success",
              output: "added 1 package in 0.9s",
            },
          ]);
          setIsRunning(false);
        }}
      >
        Simulate install
      </Button>
      <PackageInstallLog events={events} isRunning={isRunning} />
    </div>
  );
}

export function ErrorOverlayDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg border border-border bg-sandbox-editor-bg">
      {visible ? (
        <ErrorOverlay
          error={sampleRuntimeError}
          onOpenFile={() => setVisible(false)}
          onCopy={async () => {
            const { formatRuntimeErrorForCopy } = await import(
              "@/lib/sandbox/utils"
            );
            await navigator.clipboard.writeText(
              formatRuntimeErrorForCopy(sampleRuntimeError)
            );
          }}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Button onClick={() => setVisible(true)}>Show error overlay</Button>
        </div>
      )}
    </div>
  );
}

function ResizableDemoInner() {
  const sandbox = useSandbox();

  return (
    <ResizableIDELayout
      className="h-[420px] min-h-0"
      consoleCollapsed={sandbox.consoleCollapsed}
      onConsoleCollapsedChange={sandbox.setConsoleCollapsed}
      fileTree={
        <FileTree
          tree={sandbox.fileTree}
          activeFileId={sandbox.activeFileId}
          onSelectFile={sandbox.selectFile}
          className="h-full rounded-none border-0 bg-transparent"
        />
      }
      editor={
        <CodeEditor
          files={sandbox.files}
          activeFileId={sandbox.activeFileId}
          onActiveFileChange={sandbox.setActiveFileId}
          onChange={sandbox.updateFileContent}
          onFormat={sandbox.formatActiveFile}
          className="h-full rounded-none border-0 bg-transparent"
        />
      }
      preview={
        <PreviewFrame
          status={sandbox.previewStatus}
          viewport={sandbox.viewport}
          onViewportChange={sandbox.setViewport}
          srcDoc={sandbox.previewSrcDoc}
          runtimeError={sandbox.runtimeError}
          onRefresh={sandbox.refreshPreview}
          onOpenInNewTab={sandbox.openPreviewInNewTab}
          onDismissError={sandbox.dismissError}
          className="h-full rounded-none border-0 bg-transparent"
        />
      }
      console={
        <ConsolePanel
          messages={sandbox.consoleMessages}
          onClear={sandbox.clearConsole}
          className="h-full rounded-none border-0 bg-transparent"
        />
      }
    />
  );
}

export function ResizableIDELayoutDemo() {
  return (
    <SandboxProvider>
      <ResizableDemoInner />
    </SandboxProvider>
  );
}
