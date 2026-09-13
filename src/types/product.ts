import type { CategorySlug } from "@/lib/constants/categories";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  label: string; // e.g. "Size 6", "Left Hand", "Short Handle"
  priceDelta?: number; // added to base price, can be 0
  inStock: boolean;
  sku?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  price: number; // PKR, base price
  compareAtPrice?: number; // for showing a discount strike-through
  currency: "PKR";
  images: string[]; // paths under /public or remote URLs; empty = use placeholder
  specs: ProductSpec[];
  variants?: ProductVariant[];
  inStock: boolean;
  featured: boolean;
  sku: string;
  tags: string[];
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
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
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
