"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProductImage } from "@/components/products/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearchSuggestions } from "@/lib/actions/product-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatPKR } from "@/lib/currency";
import { getCategoryName } from "@/lib/constants/categories";
import type { ProductSuggestion } from "@/types";

type SearchSuggestionsProps = {
  query: string;
  onNavigate?: () => void;
};

const MIN_QUERY_LENGTH = 2;

/** Live autocomplete dropdown shared by the header search and the shop
 * page's search field — debounces the query, then asks the repository
 * (via a server action) for name/SKU/brand/category matches. */
export function SearchSuggestions({ query, onNavigate }: SearchSuggestionsProps) {
  const debouncedQuery = useDebouncedValue(query, 250);
  // Track which query a result set belongs to, rather than resetting
  // `results` in an effect when the query changes — that would mean
  // calling setState synchronously in the effect body, which can cause
  // needless extra renders. Instead a stale result set (for a shorter or
  // different query) is simply never rendered — see `showResults` below.
  const [results, setResults] = useState<{ query: string; items: ProductSuggestion[] }>({
    query: "",
    items: [],
  });
  const [isPending, startTransition] = useTransition();

  const isSearchable = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!isSearchable) return;
    startTransition(async () => {
      const suggestions = await getSearchSuggestions(debouncedQuery);
      setResults({ query: debouncedQuery, items: suggestions });
    });
  }, [debouncedQuery, isSearchable]);

  if (!isSearchable) return null;

  const showResults = results.query === debouncedQuery;
  const items = showResults ? results.items : [];

  return (
    <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover">
      {isPending || !showResults ? (
        <div className="space-y-3 p-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <SearchX className="size-5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">
            No products found for &ldquo;{debouncedQuery}&rdquo;
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((product) => (
            <li key={product.id}>
              <Link
                href={`/shop/${product.slug}`}
                onClick={onNavigate}
                className="flex items-center gap-3 p-3 transition-colors hover:bg-surface-2"
              >
                <ProductImage
                  images={product.image ? [product.image] : []}
                  name={product.name}
                  category={product.category}
                  className="size-10 shrink-0 rounded-md"
                  sizes="40px"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(product.category)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-brand">
                  {formatPKR(product.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
