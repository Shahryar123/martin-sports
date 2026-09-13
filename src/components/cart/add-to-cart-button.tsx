"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { CartLineItem } from "@/types";

type AddToCartButtonProps = {
  item: Omit<CartLineItem, "quantity">;
  quantity?: number;
  disabled?: boolean;
  label?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  /** Product cards are too narrow to fit the icon + label + the adjacent
   * WhatsApp icon button without overflowing — omit it there. */
  showIcon?: boolean;
  className?: string;
};

/**
 * The one place "add this to the persisted cart" happens — product cards,
 * the product detail buy box, and anywhere else all call this instead of
 * touching useCartStore directly, so the confirmation toast/copy stays
 * consistent.
 */
export function AddToCartButton({
  item,
  quantity = 1,
  disabled = false,
  label = "Add to Cart",
  variant = "outline",
  size = "sm",
  showIcon = true,
  className,
}: AddToCartButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...item, quantity });
    toast.success(`${item.productName} added to cart`, {
      description: item.variantLabel,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("h-11", className)}
      disabled={disabled}
      onClick={handleClick}
    >
      {showIcon && !disabled && <ShoppingCart className="size-4" />}
      <span className="truncate">{disabled ? "Sold Out" : label}</span>
    </Button>
  );
}
