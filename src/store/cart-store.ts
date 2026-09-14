import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLineItem } from "@/types";

type CartState = {
  items: CartLineItem[];
  addItem: (item: CartLineItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string,
  ) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
};

function sameLine(
  a: { productId: string; variantId?: string },
  productId: string,
  variantId?: string,
) {
  return a.productId === productId && a.variantId === variantId;
}

/** Guards against NaN/Infinity reaching cart arithmetic — e.g. a caller
 * passing an unvalidated value through, or a future schema change leaving
 * stale/malformed fields in a persisted localStorage cart. Falls back to
 * `fallback` (or drops the item from totals when fallback is null) rather
 * than letting one bad value poison the whole subtotal. */
function finiteOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const quantity = Math.max(1, Math.trunc(finiteOr(item.quantity, 1)));
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.variantId),
          );
          if (existing) {
            const merged = existing.quantity + quantity;
            const capped =
              typeof existing.maxQuantity === "number"
                ? Math.min(merged, existing.maxQuantity)
                : merged;
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variantId)
                  ? { ...i, quantity: capped }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, variantId),
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => {
          // Not a finite number (NaN/Infinity from a bad caller) — ignore
          // rather than writing a value that would corrupt every total
          // computed from this cart, including the persisted copy.
          if (!Number.isFinite(quantity)) return state;
          const next = Math.trunc(quantity);
          return {
            items:
              next <= 0
                ? state.items.filter((i) => !sameLine(i, productId, variantId))
                : state.items.map((i) =>
                    sameLine(i, productId, variantId)
                      ? {
                          ...i,
                          quantity:
                            typeof i.maxQuantity === "number"
                              ? Math.min(next, i.maxQuantity)
                              : next,
                        }
                      : i,
                  ),
          };
        }),

      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + finiteOr(item.unitPrice, 0) * finiteOr(item.quantity, 0),
          0,
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + finiteOr(item.quantity, 0), 0),
    }),
    { name: "martin-sports-cart" },
  ),
);
