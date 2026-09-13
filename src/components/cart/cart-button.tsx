"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

/** Header cart icon with a live item-count badge — always visible, not
 * tucked behind the mobile menu, so the cart stays one tap away. */
export function CartButton({ className }: { className?: string }) {
  const rawItemCount = useCartStore((state) => state.itemCount());
  const itemCount = useMounted() ? rawItemCount : 0;

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={cn("relative size-11", className)}
    >
      <Link href="/cart" aria-label={`View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}>
        <ShoppingCart className="size-5" />
        {itemCount > 0 && (
          <span className="absolute top-1 right-1 flex size-4 min-w-4 items-center justify-center rounded-full bg-brand px-0.5 text-[10px] font-semibold text-brand-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
