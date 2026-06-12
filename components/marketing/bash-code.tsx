import {
  type BashToken,
  bashTokenColors,
  tokenizeBash,
} from "@/lib/bash-highlight";
import { cn } from "@/lib/utils";

interface BashCodeProps {
  code: string;
  className?: string;
  truncate?: boolean;
}

function BashTokenSpan({ token }: { token: BashToken }) {
  return (
    <span
      style={{
        color: bashTokenColors[token.type],
        fontStyle: token.type === "comment" ? "italic" : undefined,
      }}
    >
      {token.content}
    </span>
  );
}

export function BashCode({ code, className, truncate }: BashCodeProps) {
  const tokens = tokenizeBash(code);

  return (
    <code
      className={cn(
        "font-mono text-foreground/90 text-xs leading-relaxed",
        truncate && "block min-w-0 truncate",
        className
      )}
      translate="no"
    >
      {tokens.map((token) => (
        <BashTokenSpan key={`${token.offset}-${token.type}`} token={token} />
      ))}
    </code>
  );
}
