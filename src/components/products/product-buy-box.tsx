"use client";

import { useState } from "react";
import { PriceDisplay } from "@/components/shared/price-display";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Product, StockStatus } from "@/types";

const STOCK_COPY: Record<StockStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  "in-stock": { label: "In Stock", variant: "success" },
  "low-stock": { label: "Low Stock", variant: "warning" },
  "out-of-stock": { label: "Out of Stock", variant: "destructive" },
};

export function ProductBuyBox({ product }: { product: Product }) {
  const [selectedSizeId, setSelectedSizeId] = useState(
    () => product.sizes?.find((s) => s.inStock)?.id ?? product.sizes?.[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const selectedSize = product.sizes?.find((s) => s.id === selectedSizeId);

  const priceDelta = selectedSize?.priceDelta ?? 0;
  const effectivePrice = (product.salePrice ?? product.price) + priceDelta;
  const originalPrice = product.salePrice ? product.price + priceDelta : undefined;
  const canOrder = selectedSize ? selectedSize.inStock : product.stockStatus !== "out-of-stock";
  const stock = STOCK_COPY[product.stockStatus];
  const maxQuantity =
    product.stockStatus === "low-stock" && typeof product.quantity === "number"
      ? Math.max(1, product.quantity)
      : 99;

  const lineItem = {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    sku: selectedSize?.sku ?? product.sku,
    variantId: selectedSize?.id,
    variantLabel: selectedSize?.label,
    unitPrice: effectivePrice,
    image: product.images[0] ?? "",
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <PriceDisplay price={effectivePrice} compareAtPrice={originalPrice} size="lg" />
        <Badge variant={stock.variant}>{stock.label}</Badge>
      </div>

      {product.stockStatus === "low-stock" && typeof product.quantity === "number" && product.quantity > 0 && (
        <p className="mt-1.5 text-sm font-medium text-warning">
          Only {product.quantity} left in stock
        </p>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-foreground">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                disabled={!size.inStock}
                onClick={() => setSelectedSizeId(size.id)}
                className={cn(
                  "rounded-md border px-3.5 py-2 text-sm font-medium transition-colors",
                  size.id === selectedSizeId
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-foreground-secondary hover:border-brand/40",
                  !size.inStock && "cursor-not-allowed border-border/60 text-muted-foreground line-through opacity-50",
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {canOrder && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-foreground">Quantity</p>
          <QuantityStepper quantity={quantity} onChange={setQuantity} max={maxQuantity} />
        </div>
      )}

      {/* Inline actions — hidden on small screens in favor of the sticky
          mobile bar below, so the same choice isn't offered twice. */}
      <div className="mt-6 hidden gap-3 sm:flex">
        {canOrder ? (
          <>
            <AddToCartButton
              item={lineItem}
              quantity={quantity}
              size="lg"
              className="flex-1 sm:flex-none"
            />
            <WhatsAppButton
              label="Order on WhatsApp"
              size="lg"
              className="flex-1 sm:flex-none"
              items={[{ ...lineItem, quantity }]}
            />
          </>
        ) : (
          <WhatsAppButton label="Ask About Restock" variant="outline" size="lg" />
        )}
      </div>

      <p className="mt-3 hidden text-xs text-muted-foreground sm:block">
        Cash on Delivery · Nationwide delivery across Pakistan. Opening
        WhatsApp only prepares your order message — it isn&apos;t confirmed
        until you send it and we reply.
      </p>

      {/* Sticky mobile CTA bar — always reachable while scrolling the long
          description/specs sections below, without permanently covering
          content (the page reserves bottom padding for it on small
          screens; see product detail page). */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-0/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-surface-0/90 sm:hidden">
        {canOrder ? (
          <div className="flex items-center gap-2">
            <div className="mr-1 shrink-0">
              <p className="text-sm font-semibold text-brand">{formatPKR(effectivePrice)}</p>
            </div>
            <AddToCartButton item={lineItem} quantity={quantity} size="lg" className="flex-1" />
            <WhatsAppButton
              label="Order"
              size="lg"
              className="flex-1"
              items={[{ ...lineItem, quantity }]}
            />
          </div>
        ) : (
          <WhatsAppButton label="Ask About Restock" variant="outline" size="lg" className="w-full" />
        )}
      </div>
    </div>
  );
}
