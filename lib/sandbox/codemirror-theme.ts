import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Prec } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { sandboxSyntaxColors as c } from "@/lib/sandbox/syntax-theme";

const editorTheme = EditorView.theme(
  {
    "&": {
      color: c.foreground,
      backgroundColor: "var(--sandbox-editor-bg)",
      height: "100%",
      width: "100%",
    },
    ".cm-editor": {
      height: "100%",
      width: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily:
        '"Geist Mono", "Geist Mono Fallback", ui-monospace, SFMono-Regular, monospace',
      fontSize: "12px",
      lineHeight: "1.5",
    },
    ".cm-content": {
      caretColor: "#fafafa",
    },
    ".cm-gutters": {
      backgroundColor: "var(--sandbox-editor-bg)",
      color: "#52525b",
      border: "none",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      flexShrink: "0",
    },
    ".cm-gutter.cm-lineNumbers": {
      backgroundColor: "var(--sandbox-editor-bg)",
      flexShrink: "0",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(255,255,255,0.1) !important",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#fafafa",
      borderLeftWidth: "2px",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "rgba(255,255,255,0.06)",
      border: "none",
      color: "#71717a",
      borderRadius: "0",
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "rgba(255,255,255,0.08)",
      outline: "1px solid rgba(255,255,255,0.12)",
    },
  },
  { dark: true }
);

/** Wins over CodeMirror baseTheme + basicSetup injected styles. */
const editorLayoutTheme = Prec.highest(
  EditorView.theme(
    {
      ".cm-scroller": {
        display: "flex !important",
        alignItems: "flex-start !important",
      },
      ".cm-content": {
        padding: "4px 0 !important",
        flexShrink: "0",
      },
      ".cm-line": {
        padding: "0 16px 0 10px !important",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 10px 0 12px !important",
        minWidth: "1.75em !important",
        textAlign: "right",
        whiteSpace: "nowrap",
        backgroundColor: "var(--sandbox-editor-bg)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "oklch(0.17 0 0) !important",
        borderRadius: "0 !important",
      },
      ".cm-activeLine": {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "0 !important",
      },
    },
    { dark: true }
  )
);

const highlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: c.keyword },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: c.name },
  { tag: [t.propertyName], color: c.property },
  {
    tag: [t.function(t.variableName), t.labelName],
    color: c.function,
  },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: c.constant },
  { tag: [t.definition(t.name), t.separator], color: c.name },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: c.type,
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: c.operator,
  },
  { tag: [t.meta, t.comment], color: c.comment, fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold", color: "#fafafa" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: c.property, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#fafafa" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: c.constant },
  { tag: [t.processingInstruction, t.string, t.inserted], color: c.string },
  { tag: t.invalid, color: c.invalid, borderBottom: "1px dotted #ef4444" },
]);

export const sandboxCodeMirrorTheme = [
  editorTheme,
  editorLayoutTheme,
  syntaxHighlighting(highlightStyle),
];
