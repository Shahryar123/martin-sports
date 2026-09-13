import { CATEGORIES } from "@/lib/constants/categories";
import type { CategorySlug } from "@/lib/constants/categories";
import type { ProductListParams, ProductSortOption, StockStatus } from "@/types";

/**
 * Single source of truth for the /shop URL's query-param names and parsing
 * — both the server page (page.tsx) and the client filter UI
 * (shop-filters.tsx) import from here, so they can never drift apart.
 */
export const SHOP_PARAM = {
  search: "search",
  category: "category", // single — kept for links from outside /shop (header, homepage)
  categories: "categories", // comma-separated — used by the shop's own multi-select
  label: "label", // heading override for a categories= group with no single name
  brand: "brand",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  stock: "stock", // comma-separated StockStatus[]
  featured: "featured", // "1"
  isNew: "new", // "1"
  bestSeller: "bestSeller", // "1"
  sort: "sort",
} as const;

const STOCK_STATUSES: StockStatus[] = ["in-stock", "low-stock", "out-of-stock"];
const SORT_OPTIONS: ProductSortOption[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
];

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

export type ShopSearchParams = Record<string, string | undefined>;

/** Every category currently selected, merging the singular `category` param
 * (external links) with the plural `categories` param (this page's own UI)
 * into one set. */
export function getSelectedCategories(params: ShopSearchParams): CategorySlug[] {
  const fromPlural =
    params[SHOP_PARAM.categories]
      ?.split(",")
      .map((c) => c.trim())
      .filter(isCategorySlug) ?? [];
  const fromSingular = params[SHOP_PARAM.category];
  if (fromSingular && isCategorySlug(fromSingular) && !fromPlural.includes(fromSingular)) {
    return [...fromPlural, fromSingular];
  }
  return fromPlural;
}

export function getSelectedStockStatuses(params: ShopSearchParams): StockStatus[] {
  return (
    params[SHOP_PARAM.stock]
      ?.split(",")
      .map((s) => s.trim())
      .filter((s): s is StockStatus => STOCK_STATUSES.includes(s as StockStatus)) ?? []
  );
}

export function getSort(params: ShopSearchParams): ProductSortOption {
  const raw = params[SHOP_PARAM.sort];
  return raw && SORT_OPTIONS.includes(raw as ProductSortOption)
    ? (raw as ProductSortOption)
    : "featured";
}

/** Builds the repository filter object from raw URL search params —
 * shared by the initial server-rendered page and the "Load More" action. */
export function buildListParams(
  params: ShopSearchParams,
  overrides: Partial<ProductListParams> = {},
): ProductListParams {
  const categories = getSelectedCategories(params);
  const stockStatuses = getSelectedStockStatuses(params);
  const minPrice = params[SHOP_PARAM.minPrice] ? Number(params[SHOP_PARAM.minPrice]) : undefined;
  const maxPrice = params[SHOP_PARAM.maxPrice] ? Number(params[SHOP_PARAM.maxPrice]) : undefined;

  return {
    categories: categories.length ? categories : undefined,
    brand: params[SHOP_PARAM.brand] || undefined,
    search: params[SHOP_PARAM.search] || undefined,
    stockStatuses: stockStatuses.length ? stockStatuses : undefined,
    featuredOnly: params[SHOP_PARAM.featured] === "1",
    newOnly: params[SHOP_PARAM.isNew] === "1",
    bestSellerOnly: params[SHOP_PARAM.bestSeller] === "1",
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sort: getSort(params),
    ...overrides,
  };
}
