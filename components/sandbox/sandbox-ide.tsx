"use client";

import { useSandbox } from "@/lib/sandbox/sandbox-store";
import { CodeEditor } from "./code-editor";
import { ConsolePanel } from "./console-panel";
import { FileTree } from "./file-tree";
import { PreviewFrame } from "./preview-frame";
import { ResizableIDELayout } from "./resizable-ide-layout";

interface SandboxIdeProps {
  className?: string;
  readOnly?: boolean;
  defaultConsoleSize?: number;
}

export function SandboxIDE({
  className,
  readOnly = false,
  defaultConsoleSize = 24,
}: SandboxIdeProps) {
  const sandbox = useSandbox();

  return (
    <ResizableIDELayout
      className={className}
      defaultConsoleSize={defaultConsoleSize}
      consoleCollapsed={sandbox.consoleCollapsed}
      onConsoleCollapsedChange={sandbox.setConsoleCollapsed}
      fileTree={
        <FileTree
          tree={sandbox.fileTree}
          activeFileId={sandbox.activeFileId}
          onSelectFile={sandbox.selectFile}
          onCreateFile={readOnly ? undefined : sandbox.createFile}
          onDeleteFile={readOnly ? undefined : sandbox.deleteFile}
          className="h-full rounded-none border-0 bg-transparent"
        />
      }
      editor={
        <CodeEditor
          files={sandbox.files}
          activeFileId={sandbox.activeFileId}
          onActiveFileChange={sandbox.setActiveFileId}
          onChange={sandbox.updateFileContent}
          onFormat={readOnly ? undefined : sandbox.formatActiveFile}
          readOnly={readOnly}
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
          onOpenErrorFile={sandbox.openErrorFile}
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
