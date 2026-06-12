"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  buildPreviewSrcDoc,
  createOriginalContents,
  getRunConsoleMessages,
  getSimulatedInstallEvents,
  sampleConsoleMessages,
  sampleFiles,
  sampleFileTree,
  sampleInstallEvents,
  sampleRuntimeError,
} from "./sample-files";
import type {
  ConsoleMessage,
  FileTreeNode,
  PackageInstallEvent,
  PreviewStatus,
  RuntimeError,
  SandboxFile,
  ViewportSize,
} from "./types";
import { addFileToTree, formatCode, removeFileFromTree } from "./utils";

interface SandboxContextValue {
  files: SandboxFile[];
  activeFileId: string;
  fileTree: FileTreeNode[];
  consoleMessages: ConsoleMessage[];
  installEvents: PackageInstallEvent[];
  runtimeError: RuntimeError | null;
  previewStatus: PreviewStatus;
  viewport: ViewportSize;
  previewSrcDoc: string;
  consoleCollapsed: boolean;
  isRunning: boolean;
  setActiveFileId: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  formatActiveFile: () => void;
  selectFile: (fileId: string) => void;
  createFile: () => void;
  deleteFile: (fileId: string) => void;
  clearConsole: () => void;
  setConsoleCollapsed: (collapsed: boolean) => void;
  setViewport: (viewport: ViewportSize) => void;
  refreshPreview: () => void;
  openPreviewInNewTab: () => void;
  runPreview: () => Promise<void>;
  dismissError: () => void;
  openErrorFile: () => void;
  showSampleError: () => void;
  simulateInstall: () => Promise<void>;
}

const SandboxContext = createContext<SandboxContextValue | null>(null);

interface SandboxProviderProps {
  children: ReactNode;
  initialShowError?: boolean;
  readOnly?: boolean;
}

export function SandboxProvider({
  children,
  initialShowError = false,
  readOnly = false,
}: SandboxProviderProps) {
  const [originalContents, setOriginalContents] = useState<
    Record<string, string>
  >(() => createOriginalContents(sampleFiles));
  const [files, setFiles] = useState<SandboxFile[]>(sampleFiles);
  const [activeFileId, setActiveFileId] = useState(sampleFiles[0].id);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>(sampleFileTree);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>(
    sampleConsoleMessages
  );
  const [installEvents, setInstallEvents] =
    useState<PackageInstallEvent[]>(sampleInstallEvents);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(
    initialShowError ? sampleRuntimeError : null
  );
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>("ready");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [previewSrcDoc, setPreviewSrcDoc] = useState(() =>
    buildPreviewSrcDoc(0)
  );
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const markDirtyState = useCallback(
    (nextFiles: SandboxFile[]) =>
      nextFiles.map((file) => ({
        ...file,
        isDirty: file.content !== originalContents[file.id],
      })),
    [originalContents]
  );

  const updateFileContent = useCallback(
    (id: string, content: string) => {
      if (readOnly) {
        return;
      }
      setFiles((prev) =>
        markDirtyState(
          prev.map((file) => (file.id === id ? { ...file, content } : file))
        )
      );
    },
    [markDirtyState, readOnly]
  );

  const formatActiveFile = useCallback(() => {
    if (readOnly) {
      return;
    }
    const activeFile = files.find((file) => file.id === activeFileId);
    if (!activeFile) {
      return;
    }
    updateFileContent(activeFileId, formatCode(activeFile.content));
  }, [activeFileId, files, readOnly, updateFileContent]);

  const selectFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
  }, []);

  const createFile = useCallback(() => {
    if (readOnly) {
      return;
    }
    const id = `file-new-${Date.now()}`;
    const newFile: SandboxFile = {
      id,
      name: "untitled.tsx",
      path: "components/untitled.tsx",
      language: "tsx",
      content:
        "export function Untitled() {\n  return <div>New component</div>;\n}\n",
      isDirty: true,
    };
    setFiles((prev) => [...prev, newFile]);
    setFileTree((prev) => addFileToTree(prev, newFile));
    setOriginalContents((prev) => ({ ...prev, [id]: "" }));
    setActiveFileId(id);
  }, [readOnly]);

  const deleteFile = useCallback(
    (fileId: string) => {
      if (readOnly) {
        return;
      }
      setFiles((prev) => {
        const next = prev.filter((file) => file.id !== fileId);
        if (activeFileId === fileId && next.length > 0) {
          setActiveFileId(next[0].id);
        }
        return next;
      });
      setFileTree((prev) => removeFileFromTree(prev, fileId));
    },
    [activeFileId, readOnly]
  );

  const clearConsole = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  const refreshPreview = useCallback(() => {
    setPreviewStatus("loading");
    window.setTimeout(() => {
      setPreviewStatus("ready");
      setConsoleMessages((prev) => [
        ...prev,
        {
          id: `refresh-${Date.now()}`,
          level: "info",
          message: "Preview refreshed",
          timestamp: new Date(),
          source: "preview",
        },
      ]);
    }, 600);
  }, []);

  const openPreviewInNewTab = useCallback(() => {
    const blob = new Blob([previewSrcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [previewSrcDoc]);

  const runPreview = useCallback(async () => {
    if (readOnly) {
      return;
    }
    setIsRunning(true);
    setPreviewStatus("loading");
    setRuntimeError(null);

    const pendingInstall = getSimulatedInstallEvents();
    setInstallEvents(pendingInstall);

    await new Promise((resolve) => window.setTimeout(resolve, 400));

    setInstallEvents((prev) =>
      prev.map((event) => ({
        ...event,
        status: "success",
        output: `added 1 package in ${(Math.random() * 1 + 0.5).toFixed(1)}s`,
      }))
    );

    await new Promise((resolve) => window.setTimeout(resolve, 400));

    setPreviewSrcDoc(buildPreviewSrcDoc(Math.floor(Math.random() * 5)));
    setPreviewStatus("ready");
    setConsoleMessages((prev) => [...prev, ...getRunConsoleMessages()]);
    setIsRunning(false);
  }, [readOnly]);

  const dismissError = useCallback(() => {
    setRuntimeError(null);
  }, []);

  const openErrorFile = useCallback(() => {
    const counterFile = files.find((file) => file.path.includes("counter"));
    if (counterFile) {
      setActiveFileId(counterFile.id);
    }
    setRuntimeError(null);
  }, [files]);

  const showSampleError = useCallback(() => {
    setRuntimeError(sampleRuntimeError);
    setPreviewStatus("error");
  }, []);

  const simulateInstall = useCallback(async () => {
    const events = getSimulatedInstallEvents();
    setInstallEvents(events);
    setIsRunning(true);

    for (let index = 0; index < events.length; index++) {
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      setInstallEvents((prev) =>
        prev.map((event, eventIndex) =>
          eventIndex === index
            ? {
                ...event,
                status: "success",
                output: `added 1 package in ${(Math.random() + 0.4).toFixed(1)}s`,
              }
            : event
        )
      );
    }

    setIsRunning(false);
  }, []);

  const value = useMemo<SandboxContextValue>(
    () => ({
      files,
      activeFileId,
      fileTree,
      consoleMessages,
      installEvents,
      runtimeError,
      previewStatus,
      viewport,
      previewSrcDoc,
      consoleCollapsed,
      isRunning,
      setActiveFileId,
      updateFileContent,
      formatActiveFile,
      selectFile,
      createFile,
      deleteFile,
      clearConsole,
      setConsoleCollapsed,
      setViewport,
      refreshPreview,
      openPreviewInNewTab,
      runPreview,
      dismissError,
      openErrorFile,
      showSampleError,
      simulateInstall,
    }),
    [
      files,
      activeFileId,
      fileTree,
      consoleMessages,
      installEvents,
      runtimeError,
      previewStatus,
      viewport,
      previewSrcDoc,
      consoleCollapsed,
      isRunning,
      updateFileContent,
      formatActiveFile,
      selectFile,
      createFile,
      deleteFile,
      clearConsole,
      refreshPreview,
      openPreviewInNewTab,
      runPreview,
      dismissError,
      openErrorFile,
      showSampleError,
      simulateInstall,
    ]
  );

  return (
    <SandboxContext.Provider value={value}>{children}</SandboxContext.Provider>
  );
}

export function useSandbox() {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error("useSandbox must be used within SandboxProvider");
  }
  return context;
}

export function useSandboxOptional() {
  return useContext(SandboxContext);
}
