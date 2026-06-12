import type { ReactNode } from "react";
import {
  CodeEditorDemo,
  ConsolePanelDemo,
  ErrorOverlayDemo,
  FileTreeDemo,
  PackageInstallLogDemo,
  PreviewFrameDemo,
  ResizableIDELayoutDemo,
} from "@/components/demos/sandbox-demos";

export const componentDemos: Record<string, ReactNode> = {
  "code-editor": <CodeEditorDemo />,
  "preview-frame": <PreviewFrameDemo />,
  "file-tree": <FileTreeDemo />,
  "console-panel": <ConsolePanelDemo />,
  "package-install-log": <PackageInstallLogDemo />,
  "error-overlay": <ErrorOverlayDemo />,
  "resizable-ide-layout": <ResizableIDELayoutDemo />,
};
