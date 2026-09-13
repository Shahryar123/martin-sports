"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { SearchSuggestions } from "@/components/shared/search-suggestions";
import { CATEGORIES } from "@/lib/constants/categories";
import type { CategorySlug } from "@/lib/constants/categories";
import { BRANDS } from "@/lib/constants/brands";
import { formatPKR } from "@/lib/currency";
import {
  SHOP_PARAM,
  getSelectedCategories,
  getSelectedStockStatuses,
} from "@/lib/shop/params";
import type { StockStatus } from "@/types";
import { cn } from "@/lib/utils";

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

const COLLECTION_OPTIONS = [
  { param: SHOP_PARAM.featured, label: "Featured" },
  { param: SHOP_PARAM.isNew, label: "New Arrivals" },
  { param: SHOP_PARAM.bestSeller, label: "Best Sellers" },
] as const;

type ShopFiltersProps = {
  priceBounds: { min: number; max: number };
  className?: string;
  onNavigate?: () => void;
};

export function ShopFilters({ priceBounds, className, onNavigate }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const params = Object.fromEntries(searchParams.entries());
  const [searchDraft, setSearchDraft] = useState(params[SHOP_PARAM.search] ?? "");
  const selectedCategories = getSelectedCategories(params);
  const selectedStock = getSelectedStockStatuses(params);
  const minPrice = params[SHOP_PARAM.minPrice] ? Number(params[SHOP_PARAM.minPrice]) : priceBounds.min;
  const maxPrice = params[SHOP_PARAM.maxPrice] ? Number(params[SHOP_PARAM.maxPrice]) : priceBounds.max;
  const [priceDraft, setPriceDraft] = useState<[number, number]>([minPrice, maxPrice]);

  function navigate(next: URLSearchParams) {
    // Any filter change starts the grid over from page 1.
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
    onNavigate?.();
  }

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    navigate(next);
  }

  function toggleListParam(key: string, current: string[], value: string) {
    const set = new Set(current);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    updateParam(key, set.size ? Array.from(set).join(",") : null);
  }

  /** Categories can arrive via the singular `category` param (header nav,
   * homepage links) as well as this page's own `categories` list — once the
   * checkboxes are used, that singular param (and its `label` override,
   * which no longer describes an arbitrary combination) must be cleared or
   * an unchecked category would keep reappearing from it. */
  function toggleCategory(slug: CategorySlug) {
    const set = new Set(selectedCategories);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);

    const next = new URLSearchParams(searchParams.toString());
    next.delete(SHOP_PARAM.category);
    next.delete(SHOP_PARAM.label);
    if (set.size) next.set(SHOP_PARAM.categories, Array.from(set).join(","));
    else next.delete(SHOP_PARAM.categories);
    navigate(next);
  }

  function toggleFlag(key: string, checked: boolean) {
    updateParam(key, checked ? "1" : null);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam(SHOP_PARAM.search, searchDraft || null);
  }

  function commitPrice(value: [number, number]) {
    const next = new URLSearchParams(searchParams.toString());

    if (value[0] <= priceBounds.min) next.delete(SHOP_PARAM.minPrice);
    else next.set(SHOP_PARAM.minPrice, String(value[0]));

    if (value[1] >= priceBounds.max) next.delete(SHOP_PARAM.maxPrice);
    else next.set(SHOP_PARAM.maxPrice, String(value[1]));

    navigate(next);
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStock.length > 0 ||
    !!params[SHOP_PARAM.search] ||
    !!params[SHOP_PARAM.featured] ||
    !!params[SHOP_PARAM.isNew] ||
    !!params[SHOP_PARAM.bestSeller] ||
    !!params[SHOP_PARAM.minPrice] ||
    !!params[SHOP_PARAM.maxPrice];

  function clearAll() {
    setSearchDraft("");
    setPriceDraft([priceBounds.min, priceBounds.max]);
    navigate(new URLSearchParams());
  }

  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-brand hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="pl-9"
          />
        </form>
        {searchDraft && <SearchSuggestions query={searchDraft} onNavigate={onNavigate} />}
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">Category</legend>
        <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground-secondary">
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">Brand</legend>
        {BRANDS.map((brand) => (
          <label key={brand} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground-secondary">
            <Checkbox
              checked={!params[SHOP_PARAM.brand] || params[SHOP_PARAM.brand] === brand}
              onCheckedChange={(checked) => updateParam(SHOP_PARAM.brand, checked ? null : brand)}
            />
            {brand}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">Price</legend>
        <Slider
          value={priceDraft}
          min={priceBounds.min}
          max={priceBounds.max}
          step={50}
          onValueChange={(v) => setPriceDraft(v as [number, number])}
          onValueCommit={(v) => commitPrice(v as [number, number])}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatPKR(priceDraft[0])}</span>
          <span>{formatPKR(priceDraft[1])}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">Availability</legend>
        <div className="space-y-2.5">
          {STOCK_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground-secondary">
              <Checkbox
                checked={selectedStock.includes(opt.value)}
                onCheckedChange={() =>
                  toggleListParam(SHOP_PARAM.stock, selectedStock, opt.value)
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">Collections</legend>
        <div className="space-y-2.5">
          {COLLECTION_OPTIONS.map((opt) => (
            <label key={opt.param} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground-secondary">
              <Checkbox
                checked={params[opt.param] === "1"}
                onCheckedChange={(checked) => toggleFlag(opt.param, !!checked)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
