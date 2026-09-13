"use client";

import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query hook built on useSyncExternalStore — the React APIs
 * intended for exactly this "subscribe to an external mutable source"
 * case, avoiding both a setState-in-effect and a hydration mismatch. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
