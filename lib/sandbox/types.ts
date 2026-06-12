export type ViewportSize = "desktop" | "tablet" | "mobile";
export type ConsoleLevel = "log" | "info" | "warn" | "error";
export type PreviewStatus = "idle" | "loading" | "ready" | "error";

export interface SandboxFile {
  id: string;
  name: string;
  path: string;
  language: "tsx" | "ts" | "css" | "json";
  content: string;
  isDirty?: boolean;
}

export interface ConsoleMessage {
  id: string;
  level: ConsoleLevel;
  message: string;
  timestamp: Date;
  source?: string;
}

export interface PackageInstallEvent {
  id: string;
  name: string;
  version: string;
  status: "pending" | "success" | "error";
  output?: string;
}

export interface RuntimeError {
  title: string;
  message: string;
  stack: string;
  file: string;
  line: number;
  column?: number;
}

export interface FileTreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  fileId?: string;
}

export interface SandboxState {
  files: SandboxFile[];
  originalContents: Record<string, string>;
  activeFileId: string;
  fileTree: FileTreeNode[];
  consoleMessages: ConsoleMessage[];
  installEvents: PackageInstallEvent[];
  runtimeError: RuntimeError | null;
  previewStatus: PreviewStatus;
  viewport: ViewportSize;
  previewSrcDoc: string;
  consoleCollapsed: boolean;
}
