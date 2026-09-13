"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Subtle hover/tap feedback for button-like elements — wrap a Button or
 * link in this where the interaction deserves a bit more presence than the
 * default CSS hover state (hero CTAs, primary product actions). */
export function MotionPress({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{ display: "inline-block" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  );
}
