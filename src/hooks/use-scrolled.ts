"use client";

import { useCallback, useSyncExternalStore } from "react";

/** True once the page has been scrolled past `threshold` px. Used by the
 * header to switch from transparent (over the hero) to a solid surface.
 * Built on useSyncExternalStore, same reasoning as useMediaQuery. */
export function useScrolled(threshold = 24): boolean {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("scroll", callback, { passive: true });
    return () => window.removeEventListener("scroll", callback);
  }, []);

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
