"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShopFilters } from "@/components/shop/shop-filters";
import { SHOP_PARAM, getSort } from "@/lib/shop/params";
import type { ProductSortOption } from "@/types";

const SORT_LABELS: Record<ProductSortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A-Z",
};

export function ShopToolbar({
  total,
  priceBounds,
}: {
  total: number;
  priceBounds: { min: number; max: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sort = getSort(Object.fromEntries(searchParams.entries()));

  function handleSortChange(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "featured") next.delete(SHOP_PARAM.sort);
    else next.set(SHOP_PARAM.sort, value);
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {total} product{total === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-2">
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
          <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <ShopFilters priceBounds={priceBounds} onNavigate={() => setFiltersOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]" aria-label="Sort products">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
