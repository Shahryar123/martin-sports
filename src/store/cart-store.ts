import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLineItem } from "@/types";

type CartState = {
  items: CartLineItem[];
  hasHydrated: boolean;
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
  setHasHydrated: (hydrated: boolean) => void;
};

function sameLine(
  a: { productId: string; variantId?: string },
  productId: string,
  variantId?: string,
) {
  return a.productId === productId && a.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.variantId),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variantId)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, variantId),
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, productId, variantId))
              : state.items.map((i) =>
                  sameLine(i, productId, variantId) ? { ...i, quantity } : i,
                ),
        })),

      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "martin-sports-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
