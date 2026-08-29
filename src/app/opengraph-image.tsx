import { ImageResponse } from "next/og";

import { address, brand, site } from "@/config/site";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card is generated rather than stored, so it stays in step with the
 * brand config and costs no image asset. Typography is kept to system serif —
 * loading a webfont here would add a network hop to every crawl.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.colors.paper,
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: brand.colors.gold,
          }}
        >
          {site.tagline}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 1.05,
              color: brand.colors.ink,
              maxWidth: 900,
            }}
          >
            Objects in brass and bronze, made by hand.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: brand.colors.muted,
              maxWidth: 760,
            }}
          >
            A small catalogue of forged household pieces, made one at a time in{" "}
            {address.city}.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${brand.colors.gold}`,
            paddingTop: 28,
            fontSize: 24,
            color: brand.colors.muted,
          }}
        >
          <span>{site.name}</span>
          <span>
            {address.city}, {address.country} · since {site.founded}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
