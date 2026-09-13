import type { CategorySlug } from "@/lib/constants/categories";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductOption = {
  id: string;
  label: string; // e.g. "Size 6", "Left Hand", "Short Handle"
  priceDelta?: number; // added to base/effective price, can be 0
  inStock: boolean;
  sku?: string;
};

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type ProductSeo = {
  title?: string;
  description?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string; // "Martin Sports" today; a real field so the catalog isn't hardcoded to a single brand
  category: CategorySlug;
  shortDescription: string;
  description: string;
  features: string[]; // short marketing bullet points
  specifications: ProductSpec[]; // structured technical spec table
  price: number; // PKR, regular price
  salePrice?: number; // present + lower than `price` when the product is on sale
  currency: "PKR";
  images: string[]; // paths under /public or remote URLs; empty = use placeholder
  sizes?: ProductOption[];
  stockStatus: StockStatus;
  quantity?: number; // inventory count; only surfaced to customers for low-stock urgency messaging
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  published: boolean; // unpublished products never appear in public listings/detail pages
  tags: string[]; // free-form keywords used by search, independent of category/brand
  seo?: ProductSeo; // optional per-product metadata overrides
  isPlaceholder: boolean; // true until real catalog data replaces it
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export type ProductFilters = {
  category?: CategorySlug;
  categories?: CategorySlug[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatuses?: StockStatus[];
  /** @deprecated use `stockStatuses` — kept for the "in stock only" shorthand */
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  newOnly?: boolean;
  bestSellerOnly?: boolean;
  search?: string;
  tags?: string[];
};

export type ProductListParams = ProductFilters & {
  sort?: ProductSortOption;
  page?: number;
  pageSize?: number;
};

export type ProductListResult = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Minimal shape used for search-suggestion dropdowns — cheap to send to
 * the client, doesn't leak the full product record. */
export type ProductSuggestion = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  image: string;
};
