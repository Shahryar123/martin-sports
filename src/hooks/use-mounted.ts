import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * True only after the client has mounted. Needed anywhere we render from a
 * localStorage-backed store (e.g. the cart): zustand's `persist` middleware
 * rehydrates synchronously as soon as the client bundle evaluates, which is
 * *before* React reconciles server-rendered HTML — so a component that reads
 * the store directly on first render disagrees with what the server sent
 * and React discards/rebuilds that tree. Gating the real value behind this
 * hook keeps the first client render identical to the server's, and only
 * swaps in live data once hydration is safely done.
 *
 * Implemented via useSyncExternalStore (not useState+useEffect) so it never
 * calls setState from inside an effect body.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
