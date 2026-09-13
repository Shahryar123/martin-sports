"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { loadMoreProducts } from "@/lib/actions/product-search";
import type { Product, ProductListParams } from "@/types";

type ProductGridProps = {
  initialItems: Product[];
  initialTotal: number;
  pageSize: number;
  /** Filters/sort for the *current* URL, without `page` — this component
   * owns pagination itself via the "Load More" button. */
  filters: Omit<ProductListParams, "page" | "pageSize">;
};

/**
 * Renders the first server-fetched page, then fetches subsequent pages via
 * a server action as the customer clicks "Load More" — avoids a full page
 * navigation for pagination while still going through the same repository
 * contract as the initial render (see lib/actions/product-search.ts).
 *
 * The parent server component gives this a `key` derived from the URL's
 * filters, so a filter/sort change remounts it fresh instead of trying to
 * reconcile accumulated pages with a new query.
 */
export function ProductGrid({ initialItems, initialTotal, pageSize, filters }: ProductGridProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();

  const hasMore = items.length < total;

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreProducts({ ...filters, page: nextPage, pageSize });
      setItems((prev) => [...prev, ...result.items]);
      setTotal(result.total);
      setPage(nextPage);
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 2} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Loading…" : `Load More (${total - items.length} more)`}
          </Button>
        </div>
      )}
    </div>
  );
}
