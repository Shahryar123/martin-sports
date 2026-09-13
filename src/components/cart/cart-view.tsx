"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Banknote, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { CartLineItemRow } from "@/components/cart/cart-line-item";
import { useCartStore } from "@/store/cart-store";
import { formatPKR } from "@/lib/currency";
import { generateOrderReference } from "@/lib/whatsapp";
import type { CartLineItem } from "@/types";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const [orderReference] = useState(() => generateOrderReference());

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  function handleClear() {
    const previousItems: CartLineItem[] = items;
    clear();
    toast("Cart cleared", {
      action: {
        label: "Undo",
        onClick: () => {
          previousItems.forEach((item) => useCartStore.getState().addItem(item));
        },
      },
    });
  }

  if (!hasHydrated) {
    return <div className="h-64" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the shop and add products you'd like to order via WhatsApp."
        action={
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">
            {itemCount} item{itemCount === 1 ? "" : "s"} in cart
          </p>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear Cart
          </Button>
        </div>
        <div>
          {items.map((item) => (
            <CartLineItemRow key={`${item.productId}-${item.variantId ?? "base"}`} item={item} />
          ))}
        </div>
      </div>

      <div className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
        <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold text-foreground">{formatPKR(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Final delivery details are confirmed with you on WhatsApp.
        </p>

        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Banknote className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
            Cash on Delivery Available Across Pakistan
          </p>
          <p className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Truck className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
            Nationwide delivery
          </p>
        </div>

        <div className="mt-5">
          <WhatsAppButton
            label="Order via WhatsApp"
            size="lg"
            className="w-full"
            items={items}
            orderReference={orderReference}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Reference <span className="font-medium text-foreground">{orderReference}</span> is
            included in your message. Opening WhatsApp only prepares your order — it isn&apos;t
            confirmed until you send it and we reply.
          </p>
        </div>

        <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
