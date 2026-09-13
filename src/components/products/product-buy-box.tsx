"use client";

import { useState } from "react";
import { PriceDisplay } from "@/components/shared/price-display";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Badge } from "@/components/ui/badge";
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
  const selectedSize = product.sizes?.find((s) => s.id === selectedSizeId);

  const priceDelta = selectedSize?.priceDelta ?? 0;
  const effectivePrice = (product.salePrice ?? product.price) + priceDelta;
  const originalPrice = product.salePrice ? product.price + priceDelta : undefined;
  const canOrder = selectedSize ? selectedSize.inStock : product.stockStatus !== "out-of-stock";
  const stock = STOCK_COPY[product.stockStatus];

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

      <div className="mt-6">
        {canOrder ? (
          <WhatsAppButton
            label="Order on WhatsApp"
            size="lg"
            className="w-full sm:w-auto"
            items={[
              {
                productId: product.id,
                productSlug: product.slug,
                productName: product.name,
                variantId: selectedSize?.id,
                variantLabel: selectedSize?.label,
                unitPrice: effectivePrice,
                quantity: 1,
                image: product.images[0] ?? "",
              },
            ]}
          />
        ) : (
          <WhatsAppButton
            label="Ask About Restock"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          />
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Cash on Delivery · Nationwide delivery across Pakistan
        </p>
      </div>
    </div>
  );
}
