import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/lib/seo";

export const alt = `${siteName} interactive shadcn/ui playground components`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#171717",
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: 64,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 18,
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#262626",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            display: "flex",
            fontSize: 34,
            height: 72,
            justifyContent: "center",
            width: 72,
          }}
        >
          {">_"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: "#a1a1aa", fontSize: 28 }}>
            Open-source component registry
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{siteName}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.04,
            maxWidth: 980,
          }}
        >
          shadcn/ui playground components
        </div>
        <div
          style={{
            color: "#d4d4d8",
            fontSize: 30,
            lineHeight: 1.35,
            maxWidth: 980,
          }}
        >
          {siteDescription}
        </div>
      </div>

      <div
        style={{
          color: "#a1a1aa",
          display: "flex",
          fontSize: 24,
          gap: 18,
        }}
      >
        <span>Code editor</span>
        <span>Live preview</span>
        <span>File tree</span>
        <span>Console</span>
      </div>
    </div>,
    size
  );
}
