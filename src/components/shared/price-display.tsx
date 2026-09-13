import { formatPKR } from "@/lib/currency";
import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-2xl font-semibold",
};

/** Consistent "Rs. X,XXX" price rendering, with an optional struck-through
 * compare-at price and a percentage-off badge when one is given. */
export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;
  const percentOff = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("text-brand", SIZE_CLASSES[size])}>{formatPKR(price)}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPKR(compareAtPrice)}
          </span>
          <span className="text-xs font-medium text-success">{percentOff}% off</span>
        </>
      )}
    </div>
  );
}
