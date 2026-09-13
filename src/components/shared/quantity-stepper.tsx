"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "default" | "sm";
  className?: string;
};

/** Shared +/- quantity control used on the product buy box and cart rows —
 * 44px touch targets, clamps to [min, max]. */
export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = "default",
  className,
}: QuantityStepperProps) {
  const btnSize = size === "sm" ? "icon-sm" : "icon";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size={btnSize}
        className="rounded-r-none"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </Button>
      <span
        className="min-w-8 px-1 text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size={btnSize}
        className="rounded-l-none"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
