import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { sandboxPanelHeaderClassName } from "@/lib/sandbox/utils";

interface SandboxPanelHeaderProps {
  title: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}

export function SandboxPanelHeader({
  title,
  icon: Icon,
  children,
  className,
}: SandboxPanelHeaderProps) {
  return (
    <div className={sandboxPanelHeaderClassName(className)}>
      <div className="flex min-w-0 items-center gap-1.5">
        {Icon ? (
          <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
        ) : null}
        <span className="truncate font-medium text-[11px] text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
