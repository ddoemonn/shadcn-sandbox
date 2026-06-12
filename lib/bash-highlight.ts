import { sandboxSyntaxColors } from "@/lib/sandbox/syntax-theme";

export type BashTokenType =
  | "command"
  | "package"
  | "subcommand"
  | "url"
  | "argument"
  | "flag"
  | "string"
  | "operator"
  | "comment"
  | "whitespace";

export interface BashToken {
  type: BashTokenType;
  content: string;
  offset: number;
}

const bashTokenColors: Record<BashTokenType, string> = {
  command: sandboxSyntaxColors.bashCommand,
  package: sandboxSyntaxColors.bashPackage,
  subcommand: sandboxSyntaxColors.bashSubcommand,
  url: sandboxSyntaxColors.bashUrl,
  argument: sandboxSyntaxColors.bashArgument,
  flag: sandboxSyntaxColors.keyword,
  string: sandboxSyntaxColors.string,
  operator: sandboxSyntaxColors.operator,
  comment: sandboxSyntaxColors.comment,
  whitespace: sandboxSyntaxColors.foreground,
};

const commandBreakOperators = new Set(["|", "||", "&&", ";"]);

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createToken(
  type: BashTokenType,
  content: string,
  offset: number
): BashToken {
  return { type, content, offset };
}

function readWhitespace(line: string, start: number) {
  let index = start;
  let content = "";

  while (index < line.length && /\s/.test(line[index])) {
    content += line[index];
    index += 1;
  }

  return { content, nextIndex: index };
}

function readQuotedString(line: string, start: number) {
  const quote = line[start];
  let content = quote;
  let index = start + 1;

  while (index < line.length) {
    const char = line[index];
    content += char;
    index += 1;
    if (char === "\\" && index < line.length) {
      content += line[index];
      index += 1;
      continue;
    }
    if (char === quote) {
      break;
    }
  }

  return { content, nextIndex: index };
}

function readOperator(line: string, start: number) {
  const twoChar = line.slice(start, start + 2);
  if (
    twoChar === "||" ||
    twoChar === "&&" ||
    twoChar === ">>" ||
    twoChar === "<<"
  ) {
    return { content: twoChar, nextIndex: start + 2 };
  }

  const char = line[start];
  if ("|&;<>".includes(char)) {
    return { content: char, nextIndex: start + 1 };
  }

  return null;
}

function readWord(line: string, start: number) {
  let index = start;
  let content = "";

  while (index < line.length) {
    const char = line[index];
    if (/\s/.test(char) || "#\"'|&;<>".includes(char)) {
      break;
    }
    content += char;
    index += 1;
  }

  return { content, nextIndex: index };
}

function classifyWord(
  word: string,
  expectCommand: boolean,
  argumentIndex: number
): BashTokenType {
  if (expectCommand) {
    return "command";
  }
  if (word.startsWith("-")) {
    return "flag";
  }
  if (/^https?:\/\//.test(word)) {
    return "url";
  }
  if (argumentIndex === 0 && word.includes("@")) {
    return "package";
  }
  if (argumentIndex === 1 && /^[a-z][\w-]*$/i.test(word)) {
    return "subcommand";
  }
  return "argument";
}

export function tokenizeBashLine(line: string): BashToken[] {
  return tokenizeBashLineWithOffset(line, 0);
}

interface ReadTokenResult {
  token: BashToken;
  nextIndex: number;
  stop?: boolean;
  commandBreak?: boolean;
  consumesArgument?: boolean;
}

function readNextToken(
  line: string,
  index: number,
  baseOffset: number,
  expectCommand: boolean,
  argumentIndex: number
): ReadTokenResult | null {
  const char = line[index];

  if (/\s/.test(char)) {
    const whitespace = readWhitespace(line, index);
    return {
      token: createToken("whitespace", whitespace.content, baseOffset + index),
      nextIndex: whitespace.nextIndex,
    };
  }

  if (char === "#") {
    return {
      token: createToken("comment", line.slice(index), baseOffset + index),
      nextIndex: line.length,
      stop: true,
    };
  }

  if (char === '"' || char === "'") {
    const quoted = readQuotedString(line, index);
    return {
      token: createToken("string", quoted.content, baseOffset + index),
      nextIndex: quoted.nextIndex,
      consumesArgument: true,
    };
  }

  const operator = readOperator(line, index);
  if (operator) {
    return {
      token: createToken("operator", operator.content, baseOffset + index),
      nextIndex: operator.nextIndex,
      commandBreak: commandBreakOperators.has(operator.content),
    };
  }

  const word = readWord(line, index);
  if (!word.content) {
    return null;
  }

  return {
    token: createToken(
      classifyWord(word.content, expectCommand, argumentIndex),
      word.content,
      baseOffset + index
    ),
    nextIndex: word.nextIndex,
    consumesArgument: true,
  };
}

function tokenizeBashLineWithOffset(
  line: string,
  baseOffset: number
): BashToken[] {
  const tokens: BashToken[] = [];
  let index = 0;
  let expectCommand = true;
  let argumentIndex = 0;

  while (index < line.length) {
    const result = readNextToken(
      line,
      index,
      baseOffset,
      expectCommand,
      argumentIndex
    );
    if (!result) {
      break;
    }

    tokens.push(result.token);
    index = result.nextIndex;

    if (result.stop) {
      break;
    }

    if (result.commandBreak) {
      expectCommand = true;
      argumentIndex = 0;
    } else if (result.consumesArgument && expectCommand) {
      expectCommand = false;
      argumentIndex = 0;
    } else if (result.consumesArgument) {
      argumentIndex += 1;
    }
  }

  return tokens;
}

export function tokenizeBash(code: string): BashToken[] {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  const tokens: BashToken[] = [];
  let offset = 0;

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      tokens.push(createToken("whitespace", "\n", offset));
      offset += 1;
    }
    tokens.push(...tokenizeBashLineWithOffset(line, offset));
    offset += line.length;
  });

  return tokens;
}

export function highlightBashToHtml(code: string) {
  const trimmed = code.trim();
  const tokens = tokenizeBash(trimmed);
  const lineHtml = tokens
    .map((token) => {
      const color = bashTokenColors[token.type];
      const style =
        token.type === "comment"
          ? `color:${color};font-style:italic`
          : `color:${color}`;
      return `<span style="${style}">${escapeHtml(token.content)}</span>`;
    })
    .join("");

  return `<pre class="bash-code-block sandbox-dark" style="background-color:${sandboxSyntaxColors.background};color:${sandboxSyntaxColors.foreground}" tabindex="0"><code><span class="line">${lineHtml}</span></code></pre>`;
}

export { bashTokenColors };
