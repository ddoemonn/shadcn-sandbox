import { cn } from "@/lib/utils";
import type { FileTreeNode, SandboxFile } from "./types";

export function sandboxPanelClassName(className?: string): string {
  return cn(
    "flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-transparent",
    className
  );
}

export function sandboxPanelHeaderClassName(className?: string): string {
  return cn(
    "flex shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-sandbox-gutter px-2.5 py-1.5",
    className
  );
}

export function sandboxShellClassName(className?: string): string {
  return cn(
    "overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/10",
    className
  );
}

export function getLanguageLabel(language: SandboxFile["language"]): string {
  const labels: Record<SandboxFile["language"], string> = {
    tsx: "TypeScript React",
    ts: "TypeScript",
    css: "CSS",
    json: "JSON",
  };
  return labels[language];
}

export function getLanguageBadge(language: SandboxFile["language"]): string {
  const badges: Record<SandboxFile["language"], string> = {
    tsx: "TSX",
    ts: "TS",
    css: "CSS",
    json: "JSON",
  };
  return badges[language];
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatCode(content: string): string {
  const lines = content.split("\n");
  let indent = 0;
  const formatted: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formatted.push("");
      continue;
    }

    if (/^[}\])]/.test(trimmed)) {
      indent = Math.max(0, indent - 1);
    }

    formatted.push(`${"  ".repeat(indent)}${trimmed}`);

    const openBrackets = (trimmed.match(/[{[(]/g) || []).length;
    const closeBrackets = (trimmed.match(/[}\])]/g) || []).length;
    indent += openBrackets - closeBrackets;
    indent = Math.max(0, indent);
  }

  return formatted.join("\n");
}

export function findFileIdInTree(
  nodes: FileTreeNode[],
  fileId: string
): string | null {
  for (const node of nodes) {
    if (node.type === "file" && node.fileId === fileId) {
      return node.id;
    }
    if (node.children) {
      const found = findFileIdInTree(node.children, fileId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export function removeFileFromTree(
  nodes: FileTreeNode[],
  fileId: string
): FileTreeNode[] {
  return nodes
    .filter((node) => !(node.type === "file" && node.fileId === fileId))
    .map((node) =>
      node.children
        ? { ...node, children: removeFileFromTree(node.children, fileId) }
        : node
    );
}

export function addFileToTree(
  nodes: FileTreeNode[],
  file: SandboxFile
): FileTreeNode[] {
  const parts = file.path.split("/");
  if (parts.length === 1) {
    return [
      ...nodes,
      {
        id: `tree-${file.id}`,
        name: file.name,
        type: "file" as const,
        fileId: file.id,
      },
    ];
  }

  const [folderName, ...rest] = parts;
  const existingFolderIndex = nodes.findIndex(
    (node) => node.type === "folder" && node.name === folderName
  );

  if (existingFolderIndex >= 0) {
    const folder = nodes[existingFolderIndex];
    const updatedFolder: FileTreeNode = {
      ...folder,
      children: addFileToTree(folder.children ?? [], {
        ...file,
        path: rest.join("/"),
      }),
    };
    return nodes.map((node, index) =>
      index === existingFolderIndex ? updatedFolder : node
    );
  }

  return [
    ...nodes,
    {
      id: `folder-${folderName}`,
      name: folderName,
      type: "folder" as const,
      children: addFileToTree([], { ...file, path: rest.join("/") }),
    },
  ];
}

export function getViewportWidth(viewport: "desktop" | "tablet" | "mobile") {
  const widths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  } as const;
  return widths[viewport];
}

export function formatRuntimeErrorForCopy(error: {
  title: string;
  message: string;
  stack: string;
  file: string;
  line: number;
  column?: number;
}): string {
  return `${error.title}: ${error.message}
at ${error.file}:${error.line}${error.column ? `:${error.column}` : ""}

${error.stack}`;
}
