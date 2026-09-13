"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Global Framer Motion configuration. `reducedMotion="user"` makes every
 * animation in the app automatically respect the OS-level
 * prefers-reduced-motion setting (transforms are skipped, opacity fades
 * still run) without every individual component needing to check it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: "easeOut" }}>
      {children}
    </MotionConfig>
  );
}
