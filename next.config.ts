import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Next.js's App Router streams RSC payloads and hydration bootstrap code
 * through genuinely inline `<script>` tags (`self.__next_f.push(...)`, the
 * Suspense reveal scheduler, etc.) on every page, with no nonce. A strict
 * `script-src 'self'` blocks those and breaks hydration. Doing this properly
 * without `'unsafe-inline'` means a per-request nonce generated in
 * `proxy.ts`, but that forces *every* page to render dynamically (no more
 * static/ISR product & marketing pages — see the `next build` output's `○`/
 * `●` routes) — too large a trade-off to make unilaterally here. This is
 * Next's own documented "Without Nonces" baseline (see
 * node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md);
 * revisit with a nonce-based policy if/when strict script-src becomes a
 * requirement. `'unsafe-eval'` is dev-only (React's server-error-stack
 * reconstruction; never used by React/Next in production).
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
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
    // Serve AVIF when the browser supports it (smaller than WebP at
    // comparable quality), falling back to WebP.
    formats: ["image/avif", "image/webp"],
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
