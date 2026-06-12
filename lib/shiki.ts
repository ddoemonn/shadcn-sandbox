import { createHighlighter, type Highlighter } from "shiki";
import {
  sandboxShikiTheme,
  sandboxSyntaxColors,
} from "@/lib/sandbox/syntax-theme";

const langs = ["tsx", "typescript", "json"] as const;

export type ShikiLang = (typeof langs)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [sandboxShikiTheme],
      langs: [...langs],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: ShikiLang
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.trim(), {
    lang,
    theme: sandboxShikiTheme.name,
  });
}

export { sandboxSyntaxColors };
