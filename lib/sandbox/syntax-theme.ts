import type { ThemeRegistration } from "shiki";

/** Shared syntax colors — CodeMirror + Shiki must stay in sync. */
export const sandboxSyntaxColors = {
  background: "#212121",
  foreground: "#d4d4d8",
  comment: "#52525b",
  string: "#86efac",
  keyword: "#c4b5fd",
  function: "#fcd34d",
  type: "#67e8f9",
  property: "#93c5fd",
  constant: "#fca5a5",
  operator: "#a1a1aa",
  name: "#e4e4e7",
  punctuation: "#a1a1aa",
  invalid: "#fca5a5",
  bashArgument: "#93c5fd",
  bashCommand: "#fcd34d",
  bashPackage: "#c4b5fd",
  bashSubcommand: "#e4e4e7",
  bashUrl: "#86efac",
} as const;

export const sandboxShikiTheme = {
  name: "sandbox-dark",
  type: "dark",
  colors: {
    "editor.background": sandboxSyntaxColors.background,
    "editor.foreground": sandboxSyntaxColors.foreground,
    foreground: sandboxSyntaxColors.foreground,
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        foreground: sandboxSyntaxColors.comment,
        fontStyle: "italic",
      },
    },
    {
      scope: [
        "string.quoted",
        "string.template",
        "string.interpolated",
        "string.quoted.double",
        "string.quoted.single",
        "string.quoted.double.tsx",
        "string.quoted.single.tsx",
        "string.quoted.double.js",
        "string.quoted.single.js",
      ],
      settings: { foreground: sandboxSyntaxColors.string },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "storage.type",
        "storage.modifier",
        "storage.type.function",
      ],
      settings: { foreground: sandboxSyntaxColors.keyword },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
        "entity.name.tag",
        "entity.name.tag.jsx",
        "entity.name.tag.tsx",
        "support.class.component",
        "support.class.component.jsx",
        "meta.tag.jsx entity.name.tag",
        "meta.tag.tsx entity.name.tag",
      ],
      settings: { foreground: sandboxSyntaxColors.function },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "support.type.primitive",
        "entity.other.inherited-class",
      ],
      settings: { foreground: sandboxSyntaxColors.type },
    },
    {
      scope: [
        "variable.other.property",
        "support.type.property-name",
        "support.type.property-name.css",
        "entity.other.attribute-name",
        "entity.other.attribute-name.jsx",
        "entity.other.attribute-name.tsx",
        "meta.object-literal.key",
        "string.unquoted.js",
      ],
      settings: { foreground: sandboxSyntaxColors.property },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.other.readwrite",
        "variable.parameter",
        "meta.definition.variable",
      ],
      settings: { foreground: sandboxSyntaxColors.name },
    },
    {
      scope: [
        "constant",
        "constant.numeric",
        "constant.language",
        "constant.character",
        "support.constant",
      ],
      settings: { foreground: sandboxSyntaxColors.constant },
    },
    {
      scope: [
        "keyword.operator",
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
        "punctuation.definition.tag",
        "punctuation.section.embedded",
        "meta.brace",
        "meta.delimiter",
      ],
      settings: { foreground: sandboxSyntaxColors.operator },
    },
    {
      scope: ["invalid", "invalid.illegal"],
      settings: {
        foreground: sandboxSyntaxColors.invalid,
        fontStyle: "underline",
      },
    },
    {
      scope: ["meta.embedded", "source.js", "source.ts", "source.tsx"],
      settings: { foreground: sandboxSyntaxColors.foreground },
    },
  ],
} satisfies ThemeRegistration;

export type SandboxShikiTheme = typeof sandboxShikiTheme;
