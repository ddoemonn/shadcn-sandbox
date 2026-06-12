"use client";

import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import type { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { Braces, Check, Copy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sandboxCodeMirrorTheme } from "@/lib/sandbox/codemirror-theme";
import type { SandboxFile } from "@/lib/sandbox/types";
import { getLanguageBadge, sandboxPanelClassName } from "@/lib/sandbox/utils";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  files: SandboxFile[];
  activeFileId: string;
  onActiveFileChange: (id: string) => void;
  onChange: (id: string, content: string) => void;
  onFormat?: () => void;
  readOnly?: boolean;
  className?: string;
}

export function CodeEditor({
  files,
  activeFileId,
  onActiveFileChange,
  onChange,
  onFormat,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const activeFile = files.find((file) => file.id === activeFileId) ?? files[0];

  const extensions = useMemo(() => {
    if (!activeFile) {
      return sandboxCodeMirrorTheme;
    }
    const languageExt: Extension =
      activeFile.language === "css"
        ? css()
        : activeFile.language === "json"
          ? json()
          : javascript({ jsx: true, typescript: true });
    return [...sandboxCodeMirrorTheme, languageExt];
  }, [activeFile]);

  const handleCopy = useCallback(async () => {
    if (!activeFile) {
      return;
    }
    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [activeFile]);

  if (!activeFile) {
    return null;
  }

  return (
    <div className={cn(sandboxPanelClassName(className), "h-full w-full")}>
      <div className="flex shrink-0 overflow-x-auto border-border/60 border-b bg-sandbox-gutter">
        <div className="flex" role="tablist" aria-label="Open files">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <button
                key={file.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onActiveFileChange(file.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 border-border/60 border-r px-2.5 py-1.5 text-[11px] leading-tight transition-colors",
                  isActive
                    ? "border-t-2 border-t-primary bg-sandbox-editor-bg text-foreground"
                    : "border-t-2 border-t-transparent text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                <span className="whitespace-nowrap font-mono">{file.name}</span>
                {file.isDirty ? (
                  <span className="size-1.5 rounded-full bg-primary">
                    <span className="sr-only">Unsaved changes</span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-border/60 border-b bg-sandbox-gutter px-2.5 py-1">
        <p
          className="min-w-0 truncate font-mono text-[10px] text-muted-foreground"
          title={activeFile.path}
          translate="no"
        >
          {activeFile.path}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant="outline" className="font-mono text-[10px]">
            {getLanguageBadge(activeFile.language)}
          </Badge>
          {onFormat ? (
            <Button variant="ghost" size="xs" onClick={onFormat}>
              <Braces data-icon="inline-start" />
              Format
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            {copied ? (
              <Check data-icon="inline-start" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div
        className="sandbox-codemirror relative min-h-0 w-full flex-1"
        role="tabpanel"
        translate="no"
        spellCheck={false}
      >
        <CodeMirror
          value={activeFile.content}
          height="100%"
          width="100%"
          theme="none"
          extensions={extensions}
          editable={!readOnly}
          onChange={(value) => onChange(activeFile.id, value)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            indentOnInput: true,
            closeBrackets: true,
          }}
        />
      </div>
    </div>
  );
}
