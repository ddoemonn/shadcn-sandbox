"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

export function SiteFooterWrapper() {
  const pathname = usePathname();

  if (pathname === "/playground") {
    return null;
  }

  return <SiteFooter />;
}
