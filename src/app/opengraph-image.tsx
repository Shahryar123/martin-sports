import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph / Twitter card image, generated at request time
 * (no real brand photography/design asset exists yet — see
 * ARCHITECTURE.md "Image & data replacement strategy"). `buildMetadata()`
 * points every page's `openGraph`/`twitter` image at this route
 * (`SITE_CONFIG.ogImage`) unless a page supplies its own (e.g. a product
 * photo).
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1f2229",
          color: "#f5f5f2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d4af5a",
            marginBottom: 20,
          }}
        >
          {SITE_CONFIG.name}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: "center", padding: "0 80px" }}>
          {SITE_CONFIG.tagline}
        </div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#c7c9d1" }}>
          Nationwide Delivery · Cash on Delivery
        </div>
      </div>
    ),
    { ...size },
  );
}
