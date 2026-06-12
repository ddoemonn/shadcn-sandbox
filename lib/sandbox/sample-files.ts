import type {
  ConsoleMessage,
  FileTreeNode,
  PackageInstallEvent,
  RuntimeError,
  SandboxFile,
} from "./types";

export const SAMPLE_COUNTER_PAGE = `"use client";

import { Counter } from "@/components/counter";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <Counter initialCount={0} />
    </main>
  );
}
`;

export const SAMPLE_COUNTER_COMPONENT = `"use client";

import { useState } from "react";

interface CounterProps {
  initialCount?: number;
}

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
      <p className="mb-2 text-sm text-zinc-400">Interactive Counter</p>
      <p className="mb-6 text-5xl font-semibold tabular-nums text-white">
        {count}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          Decrement
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
`;

export const SAMPLE_GLOBALS_CSS = `@import "tailwindcss";

:root {
  --background: #09090b;
  --foreground: #fafafa;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: system-ui, sans-serif;
}
`;

export const SAMPLE_PACKAGE_JSON = `{
  "name": "counter-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "lucide-react": "^1.17.0"
  }
}
`;

export const sampleFiles: SandboxFile[] = [
  {
    id: "file-page",
    name: "page.tsx",
    path: "app/page.tsx",
    language: "tsx",
    content: SAMPLE_COUNTER_PAGE,
  },
  {
    id: "file-counter",
    name: "counter.tsx",
    path: "components/counter.tsx",
    language: "tsx",
    content: SAMPLE_COUNTER_COMPONENT,
  },
  {
    id: "file-globals",
    name: "globals.css",
    path: "styles/globals.css",
    language: "css",
    content: SAMPLE_GLOBALS_CSS,
  },
  {
    id: "file-package",
    name: "package.json",
    path: "package.json",
    language: "json",
    content: SAMPLE_PACKAGE_JSON,
  },
];

export const sampleFileTree: FileTreeNode[] = [
  {
    id: "folder-app",
    name: "app",
    type: "folder",
    children: [
      {
        id: "tree-page",
        name: "page.tsx",
        type: "file",
        fileId: "file-page",
      },
    ],
  },
  {
    id: "folder-components",
    name: "components",
    type: "folder",
    children: [
      {
        id: "tree-counter",
        name: "counter.tsx",
        type: "file",
        fileId: "file-counter",
      },
    ],
  },
  {
    id: "folder-styles",
    name: "styles",
    type: "folder",
    children: [
      {
        id: "tree-globals",
        name: "globals.css",
        type: "file",
        fileId: "file-globals",
      },
    ],
  },
  {
    id: "tree-package",
    name: "package.json",
    type: "file",
    fileId: "file-package",
  },
];

export const sampleConsoleMessages: ConsoleMessage[] = [
  {
    id: "log-1",
    level: "info",
    message: "Dev server ready on http://localhost:3000",
    timestamp: new Date("2026-06-11T10:00:01"),
    source: "next",
  },
  {
    id: "log-2",
    level: "log",
    message: "Compiling / ...",
    timestamp: new Date("2026-06-11T10:00:02"),
    source: "compiler",
  },
  {
    id: "log-3",
    level: "log",
    message: "Compiled successfully in 412ms",
    timestamp: new Date("2026-06-11T10:00:03"),
    source: "compiler",
  },
  {
    id: "log-4",
    level: "warn",
    message: "Fast Refresh had to perform a full reload.",
    timestamp: new Date("2026-06-11T10:00:05"),
    source: "hmr",
  },
  {
    id: "log-5",
    level: "error",
    message: "TypeError: Cannot read properties of undefined (reading 'count')",
    timestamp: new Date("2026-06-11T10:00:08"),
    source: "runtime",
  },
];

export const sampleInstallEvents: PackageInstallEvent[] = [
  {
    id: "install-1",
    name: "@radix-ui/react-slot",
    version: "1.2.3",
    status: "success",
    output: "added 1 package in 1.2s",
  },
  {
    id: "install-2",
    name: "lucide-react",
    version: "0.511.0",
    status: "success",
    output: "added 1 package in 0.8s",
  },
  {
    id: "install-3",
    name: "@broken/package",
    version: "0.0.1",
    status: "error",
    output:
      "npm ERR! 404 Not Found - GET https://registry.npmjs.org/@broken/package",
  },
];

export const sampleRuntimeError: RuntimeError = {
  title: "Runtime Error",
  message: "Cannot read properties of undefined (reading 'count')",
  stack: `TypeError: Cannot read properties of undefined (reading 'count')
    at Counter (components/counter.tsx:14:5)
    at renderWithHooks (react-dom/cjs/react-dom.development.js:15486:18)
    at mountIndeterminateComponent (react-dom/cjs/react-dom.development.js:20103:13)
    at beginWork (react-dom/cjs/react-dom.development.js:21626:16)`,
  file: "components/counter.tsx",
  line: 14,
  column: 5,
};

export function buildPreviewSrcDoc(count = 0): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #09090b;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .card {
      border: 1px solid #27272a;
      background: #18181b;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      min-width: 280px;
    }
    .label { color: #a1a1aa; font-size: 13px; margin-bottom: 8px; }
    .count {
      color: #fafafa;
      font-size: 48px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      margin-bottom: 24px;
    }
    .actions { display: flex; gap: 12px; justify-content: center; }
    button {
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #3f3f46;
      background: transparent;
      color: #e4e4e7;
    }
    button.primary {
      background: #fafafa;
      color: #18181b;
      border-color: #fafafa;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <p class="label">Interactive Counter</p>
    <p class="count" id="count">${count}</p>
    <div class="actions">
      <button onclick="update(-1)">Decrement</button>
      <button class="primary" onclick="update(1)">Increment</button>
    </div>
  </div>
  <script>
    let count = ${count};
    function update(delta) {
      count += delta;
      document.getElementById('count').textContent = count;
    }
  </script>
</body>
</html>`;
}

export function createOriginalContents(
  files: SandboxFile[]
): Record<string, string> {
  return Object.fromEntries(files.map((file) => [file.id, file.content]));
}

export function getRunConsoleMessages(): ConsoleMessage[] {
  const now = new Date();
  return [
    {
      id: `run-${now.getTime()}-1`,
      level: "log",
      message: "Rebuilding preview...",
      timestamp: now,
      source: "sandbox",
    },
    {
      id: `run-${now.getTime()}-2`,
      level: "info",
      message: "Bundled 4 modules in 186ms",
      timestamp: new Date(now.getTime() + 120),
      source: "sandbox",
    },
    {
      id: `run-${now.getTime()}-3`,
      level: "log",
      message: "Preview updated successfully",
      timestamp: new Date(now.getTime() + 240),
      source: "sandbox",
    },
  ];
}

export function getSimulatedInstallEvents(): PackageInstallEvent[] {
  return [
    {
      id: "sim-1",
      name: "class-variance-authority",
      version: "0.7.1",
      status: "pending",
    },
    {
      id: "sim-2",
      name: "tailwind-merge",
      version: "3.6.0",
      status: "pending",
    },
  ];
}
