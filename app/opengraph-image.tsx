import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cursor India — Build with Cursor in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(255,255,255,0.06) 0%, transparent 60%), #1b1b1b",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#111114",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fafafa",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ⟆
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 22, fontWeight: 600 }}>Cursor India</span>
            <span
              style={{
                fontSize: 12,
                color: "#a1a1aa",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Community
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
          <span
            style={{
              fontSize: 80,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Build with Cursor in India.
          </span>
          <span style={{ fontSize: 26, color: "#a1a1aa", lineHeight: 1.4 }}>
            Café Cursor, workshops, meetups, and hackathons across Indian cities.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#71717a",
            fontSize: 18,
          }}
        >
          <span>cursor-india.vercel.app</span>
          <span>By the community, for the community.</span>
        </div>
      </div>
    ),
    size,
  );
}
