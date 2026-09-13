"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleProductFlagAction } from "@/lib/actions/admin-products";

type ProductFlag = "published" | "featured" | "isNew" | "bestSeller";

type ProductFlagToggleProps = {
  productId: string;
  flag: ProductFlag;
  value: boolean;
  icon: LucideIcon;
  activeLabel: string;
  inactiveLabel: string;
};

/** Compact icon toggle for a single boolean product flag — used in the
 * products table so publish/featured/new/best-seller can be flipped without
 * opening the full edit form. */
export function ProductFlagToggle({
  productId,
  flag,
  value,
  icon: Icon,
  activeLabel,
  inactiveLabel,
}: ProductFlagToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleProductFlagAction(productId, flag, !value);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={handleClick}
      aria-label={value ? activeLabel : inactiveLabel}
      aria-pressed={value}
      title={value ? activeLabel : inactiveLabel}
    >
      <Icon
        className={cn("size-4", value ? "fill-brand text-brand" : "text-muted-foreground")}
        strokeWidth={1.75}
      />
    </Button>
  );
}
