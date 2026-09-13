"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { formatPKR } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";
import type { CartLineItem } from "@/types";

export function CartLineItemRow({ item }: { item: CartLineItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className="flex gap-4 border-b border-border py-5 last:border-b-0">
      <Link
        href={`/shop/${item.productSlug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface-1 sm:size-24"
      >
        {item.image && (
          <Image src={item.image} alt={item.productName} fill sizes="96px" className="object-cover" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${item.productSlug}`}
              className="line-clamp-2 text-sm font-medium text-foreground hover:text-brand sm:text-base"
            >
              {item.productName}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              SKU: {item.sku}
              {item.variantLabel ? ` · ${item.variantLabel}` : ""}
            </p>
            <p className="mt-1 text-sm text-foreground-secondary sm:hidden">
              {formatPKR(item.unitPrice)} each
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${item.productName} from cart`}
            onClick={() => removeItem(item.productId, item.variantId)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper
            quantity={item.quantity}
            onChange={(quantity) => updateQuantity(item.productId, quantity, item.variantId)}
            size="sm"
          />
          <div className="text-right">
            <p className="hidden text-sm text-muted-foreground sm:block">
              {formatPKR(item.unitPrice)} each
            </p>
            <p className="font-semibold text-foreground">{formatPKR(lineTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
