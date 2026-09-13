import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // /products was the phase-1 placeholder listing; /shop is the real
    // implementation. Redirect rather than 404 in case anything (bookmarks,
    // dev-time links) still points at the old path.
    return [
      { source: "/products", destination: "/shop", permanent: false },
      { source: "/products/:slug", destination: "/shop/:slug", permanent: false },
    ];
  },
  images: {
    // Placeholder catalog images under /public/placeholders are static,
    // locally-authored SVGs (not user-uploaded), so allowing SVG through
    // the image optimizer here is safe. Real product photography will be
    // raster (JPEG/WebP) and won't need this — see ARCHITECTURE.md.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // The admin product/category/ambassador forms accept any https image
    // URL (there's no fixed CDN/host yet, and no upload storage — see
    // ARCHITECTURE.md "Image & data replacement strategy"), so the
    // optimizer needs a permissive remote pattern rather than one fixed
    // host. Only authenticated admins can set these URLs. Narrow this to
    // real image host(s) once one is chosen.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
