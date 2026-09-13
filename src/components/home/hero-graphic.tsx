"use client";

import { motion } from "framer-motion";

/**
 * Temporary hero visual: a stylised cricket ball composition rendered in
 * inline SVG rather than a stock photo. Consistent with the rest of the
 * site's image strategy (ProductImage) — real athlete/product photography
 * drops in later without needing a placeholder-vs-real seam here, since
 * this is decorative brand artwork, not catalog data.
 */
export function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-brand/10 blur-3xl" />

      <motion.svg
        viewBox="0 0 400 400"
        className="relative size-full"
        initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <circle cx="200" cy="200" r="170" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="var(--border)" strokeWidth="1" />

        {/* Ball */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle cx="200" cy="200" r="108" fill="oklch(0.32 0.16 25)" />
          <circle cx="200" cy="200" r="108" fill="url(#ballShine)" />
          <path
            d="M 92 200 A 108 108 0 0 1 200 92"
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="2.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <path
            d="M 308 200 A 108 108 0 0 1 200 308"
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="2.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <path
            d="M 200 92 A 108 108 0 0 1 308 200"
            fill="none"
            stroke="oklch(0.6 0.02 25)"
            strokeWidth="1.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <path
            d="M 200 308 A 108 108 0 0 1 92 200"
            fill="none"
            stroke="oklch(0.6 0.02 25)"
            strokeWidth="1.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
        </motion.g>

        <defs>
          <radialGradient id="ballShine" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
