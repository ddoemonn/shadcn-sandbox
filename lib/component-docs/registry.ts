export interface ComponentDoc {
  slug: string;
  title: string;
  description: string;
  installCommand: string;
  usageCode: string;
}

export const componentDocs: ComponentDoc[] = [
  {
    slug: "code-editor",
    title: "CodeEditor",
    description:
      "Syntax-highlighted editor with tabs, dirty indicators, format and copy actions.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/code-editor.json",
    usageCode: `import { CodeEditor } from "@/components/sandbox/code-editor";

export function EditorPanel() {
  return (
    <CodeEditor
      files={files}
      activeFileId={activeFileId}
      onActiveFileChange={setActiveFileId}
      onChange={updateFileContent}
      onFormat={formatActiveFile}
    />
  );
}`,
  },
  {
    slug: "preview-frame",
    title: "PreviewFrame",
    description:
      "Live preview surface with viewport controls, refresh, and runtime error overlay support.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/preview-frame.json",
    usageCode: `import { PreviewFrame } from "@/components/sandbox/preview-frame";

export function PreviewPanel() {
  return (
    <PreviewFrame
      status={previewStatus}
      viewport={viewport}
      onViewportChange={setViewport}
      srcDoc={previewSrcDoc}
      runtimeError={runtimeError}
      onRefresh={refreshPreview}
      onOpenInNewTab={openPreviewInNewTab}
      onDismissError={dismissError}
    />
  );
}`,
  },
  {
    slug: "file-tree",
    title: "FileTree",
    description:
      "Nested explorer with folder collapse, active selection, and file actions.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/file-tree.json",
    usageCode: `import { FileTree } from "@/components/sandbox/file-tree";

export function ExplorerPanel() {
  return (
    <FileTree
      tree={fileTree}
      activeFileId={activeFileId}
      onSelectFile={selectFile}
      onCreateFile={createFile}
      onDeleteFile={deleteFile}
    />
  );
}`,
  },
  {
    slug: "console-panel",
    title: "ConsolePanel",
    description:
      "Bottom console with log levels, timestamps, clear action, and collapse.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/console-panel.json",
    usageCode: `import { ConsolePanel } from "@/components/sandbox/console-panel";

export function ConsoleDock() {
  return (
    <ConsolePanel
      messages={consoleMessages}
      onClear={clearConsole}
      collapsed={consoleCollapsed}
      onCollapsedChange={setConsoleCollapsed}
    />
  );
}`,
  },
  {
    slug: "package-install-log",
    title: "PackageInstallLog",
    description:
      "Terminal-style install output with pending, success, and failure states.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/package-install-log.json",
    usageCode: `import { PackageInstallLog } from "@/components/sandbox/package-install-log";

export function InstallTerminal() {
  return (
    <PackageInstallLog
      events={installEvents}
      isRunning={isRunning}
    />
  );
}`,
  },
  {
    slug: "error-overlay",
    title: "ErrorOverlay",
    description:
      "Runtime error overlay with stack trace, open file, and copy actions.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/error-overlay.json",
    usageCode: `import { ErrorOverlay } from "@/components/sandbox/error-overlay";

export function PreviewError({ error }: { error: RuntimeError }) {
  return (
    <ErrorOverlay
      error={error}
      onOpenFile={openErrorFile}
      onCopy={copyErrorToClipboard}
      onDismiss={dismissError}
    />
  );
}`,
  },
  {
    slug: "resizable-ide-layout",
    title: "ResizableIDELayout",
    description:
      "VS Code-like layout composing explorer, editor, preview, and console.",
    installCommand:
      "bunx --bun shadcn@latest add https://shadcn-sandbox.vercel.app/r/resizable-ide-layout.json",
    usageCode: `import { ResizableIDELayout } from "@/components/sandbox/resizable-ide-layout";

export function PlaygroundShell() {
  return (
    <ResizableIDELayout
      fileTree={<FileTree {...fileTreeProps} />}
      editor={<CodeEditor {...editorProps} />}
      preview={<PreviewFrame {...previewProps} />}
      console={<ConsolePanel {...consoleProps} />}
    />
  );
}`,
  },
];

export function getComponentDoc(slug: string) {
  return componentDocs.find((doc) => doc.slug === slug);
}

export function getComponentSlugs() {
  return componentDocs.map((doc) => doc.slug);
}
