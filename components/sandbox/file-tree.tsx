"use client";

import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileJson,
  FilePlus2,
  Files,
  FileType,
  Folder,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { FileTreeNode } from "@/lib/sandbox/types";
import { sandboxPanelClassName } from "@/lib/sandbox/utils";
import { cn } from "@/lib/utils";
import { SandboxPanelHeader } from "./panel-chrome";

interface FileTreeProps {
  tree: FileTreeNode[];
  activeFileId?: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile?: () => void;
  onDeleteFile?: (fileId: string) => void;
  className?: string;
}

function FileIcon({ name }: { name: string }) {
  if (name.endsWith(".json")) {
    return (
      <FileJson
        className="size-3.5 shrink-0 text-yellow-400/85"
        aria-hidden="true"
      />
    );
  }
  if (name.endsWith(".css")) {
    return (
      <FileType
        className="size-3.5 shrink-0 text-violet-400/85"
        aria-hidden="true"
      />
    );
  }
  return (
    <FileCode2
      className="size-3.5 shrink-0 text-sky-400/85"
      aria-hidden="true"
    />
  );
}

interface TreeNodeProps {
  node: FileTreeNode;
  depth: number;
  activeFileId?: string;
  onSelectFile: (fileId: string) => void;
  onDeleteFile?: (fileId: string) => void;
}

function TreeNode({
  node,
  depth,
  activeFileId,
  onSelectFile,
  onDeleteFile,
}: TreeNodeProps) {
  const [open, setOpen] = useState(true);

  if (node.type === "folder") {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className="flex w-full items-center gap-1 px-1.5 py-0.5 text-[11px] text-muted-foreground leading-tight hover:bg-foreground/[0.04] hover:text-foreground"
          style={{ paddingLeft: `${depth * 10 + 6}px` }}
        >
          {open ? (
            <ChevronDown
              className="size-3 shrink-0 opacity-60"
              aria-hidden="true"
            />
          ) : (
            <ChevronRight
              className="size-3 shrink-0 opacity-60"
              aria-hidden="true"
            />
          )}
          {open ? (
            <FolderOpen
              className="size-3.5 shrink-0 text-amber-400/90"
              aria-hidden="true"
            />
          ) : (
            <Folder
              className="size-3.5 shrink-0 text-amber-400/75"
              aria-hidden="true"
            />
          )}
          <span className="truncate">{node.name}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const isActive = node.fileId === activeFileId;
  const fileId = node.fileId;

  return (
    <div
      className="group flex items-center"
      style={{ paddingLeft: `${depth * 10 + 6}px` }}
    >
      <button
        type="button"
        onClick={() => {
          if (fileId) {
            onSelectFile(fileId);
          }
        }}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1 px-1.5 py-0.5 text-[11px] leading-tight transition-colors",
          isActive
            ? "bg-foreground/[0.06] text-foreground"
            : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
        )}
      >
        <FileIcon name={node.name} />
        <span className="truncate">{node.name}</span>
      </button>
      {onDeleteFile && fileId ? (
        <Button
          variant="ghost"
          size="icon-xs"
          className="mr-0.5 size-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onDeleteFile(fileId)}
          aria-label={`Delete ${node.name}`}
        >
          <Trash2 className="size-3" aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}

export function FileTree({
  tree,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  className,
}: FileTreeProps) {
  return (
    <div className={cn(sandboxPanelClassName(className), "h-full")}>
      <SandboxPanelHeader title="Explorer" icon={Files}>
        {onCreateFile ? (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCreateFile}
            aria-label="Create new file"
          >
            <FilePlus2 className="size-3.5" aria-hidden="true" />
          </Button>
        ) : null}
      </SandboxPanelHeader>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 py-1">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
          />
        ))}
      </div>
    </div>
  );
}
