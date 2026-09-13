import { PRODUCTS } from "@/lib/data/products";
import { getCategoryName } from "@/lib/constants/categories";
import type {
  Product,
  ProductListParams,
  ProductListResult,
  ProductSuggestion,
} from "@/types";

/**
 * Contract every product data source must satisfy. Route/page/component code
 * should depend only on this interface (via `productRepository` below), never
 * on `PRODUCTS` or a specific implementation directly — that's what makes it
 * possible to swap in a real database later without touching call sites.
 *
 * All methods are async so a future DB/ORM-backed implementation is a
 * drop-in replacement. The public methods (`list`, `getBySlug`, `getById`,
 * `getFeatured`, `getRelated`, `suggest`) only ever return `published`
 * products — there is no public-facing way to read a draft/unpublished one.
 * The `admin*` methods (used only by `/admin/products`) see every product
 * regardless of status and are the only way to mutate the catalog.
 */
export interface ProductRepository {
  list(params?: ProductListParams): Promise<ProductListResult>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getFeatured(limit?: number): Promise<Product[]>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
  getAllSlugs(): Promise<string[]>;
  /** Lightweight matches for a search-suggestions dropdown. */
  suggest(query: string, limit?: number): Promise<ProductSuggestion[]>;
  /** Min/max effective price across the catalog — feeds the shop price
   * filter's slider domain so it's never hardcoded/stale. */
  getPriceBounds(): Promise<{ min: number; max: number }>;

  /** Admin-only: every product regardless of published status, with
   * search/filter/pagination for the `/admin/products` table. */
  adminList(params?: AdminProductListParams): Promise<ProductListResult>;
  adminGetById(id: string): Promise<Product | null>;
  create(input: ProductWriteInput): Promise<Product>;
  update(id: string, input: Partial<ProductWriteInput>): Promise<Product>;
  delete(id: string): Promise<void>;
  /** Admin stats for the dashboard — counts across the *entire* catalog
   * (not just published products). */
  getStats(): Promise<ProductStats>;
}

export type AdminProductListParams = {
  search?: string;
  category?: string;
  status?: "published" | "draft";
  stockStatus?: Product["stockStatus"];
  featured?: boolean;
  page?: number;
  pageSize?: number;
};

export type ProductWriteInput = {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Product["specifications"];
  price: number;
  salePrice?: number;
  currency: "PKR";
  images: string[];
  sizes?: Product["sizes"];
  stockStatus: Product["stockStatus"];
  quantity?: number;
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  published: boolean;
  seo?: Product["seo"];
};

export type ProductStats = {
  total: number;
  published: number;
  draft: number;
  featured: number;
  lowStock: number;
  recent: Product[];
};

const DEFAULT_PAGE_SIZE = 12;
const RECENT_PRODUCTS_LIMIT = 5;

function sortProducts(products: Product[], sort: ProductListParams["sort"]) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured),
      );
  }
}

function effectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

function paginate(items: Product[], page: number, pageSize: number): ProductListResult {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

/**
 * In-memory implementation backed by the placeholder seed data in
 * `lib/data/products.ts`, plus whatever the admin has created/edited since
 * the server started. See ARCHITECTURE.md ("Data layer") for the plan to
 * replace this with a database-backed implementation — nothing outside this
 * file (and its admin server actions) needs to change for that swap.
 */
class InMemoryProductRepository implements ProductRepository {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = [...products];
  }

  private published(): Product[] {
    return this.products.filter((p) => p.published);
  }

  private matchesSearch(product: Product, query: string): boolean {
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      getCategoryName(product.category).toLowerCase().includes(q) ||
      product.shortDescription.toLowerCase().includes(q) ||
      product.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  async list(params: ProductListParams = {}): Promise<ProductListResult> {
    const {
      category,
      categories,
      brand,
      minPrice,
      maxPrice,
      stockStatuses,
      inStockOnly,
      featuredOnly,
      newOnly,
      bestSellerOnly,
      search,
      tags,
      sort = "featured",
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = params;

    let filtered = this.published();

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (categories?.length) {
      filtered = filtered.filter((p) => categories.includes(p.category));
    }
    if (brand) {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    if (typeof minPrice === "number") {
      filtered = filtered.filter((p) => effectivePrice(p) >= minPrice);
    }
    if (typeof maxPrice === "number") {
      filtered = filtered.filter((p) => effectivePrice(p) <= maxPrice);
    }
    if (stockStatuses?.length) {
      filtered = filtered.filter((p) => stockStatuses.includes(p.stockStatus));
    } else if (inStockOnly) {
      filtered = filtered.filter((p) => p.stockStatus !== "out-of-stock");
    }
    if (featuredOnly) {
      filtered = filtered.filter((p) => p.featured);
    }
    if (newOnly) {
      filtered = filtered.filter((p) => p.isNew);
    }
    if (bestSellerOnly) {
      filtered = filtered.filter((p) => p.bestSeller);
    }
    if (tags?.length) {
      filtered = filtered.filter((p) => tags.some((t) => p.tags.includes(t)));
    }
    if (search?.trim()) {
      const q = search.trim();
      filtered = filtered.filter((p) => this.matchesSearch(p, q));
    }

    const sorted = sortProducts(filtered, sort);
    return paginate(sorted, page, pageSize);
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return this.published().find((p) => p.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Product | null> {
    return this.published().find((p) => p.id === id) ?? null;
  }

  async getFeatured(limit = 8): Promise<Product[]> {
    return this.published()
      .filter((p) => p.featured)
      .slice(0, limit);
  }

  async getRelated(product: Product, limit = 4): Promise<Product[]> {
    return this.published()
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }

  async getAllSlugs(): Promise<string[]> {
    return this.published().map((p) => p.slug);
  }

  async getPriceBounds(): Promise<{ min: number; max: number }> {
    const prices = this.published().map(effectivePrice);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 0),
    };
  }

  async suggest(query: string, limit = 6): Promise<ProductSuggestion[]> {
    const q = query.trim();
    if (!q) return [];

    return this.published()
      .filter((p) => this.matchesSearch(p, q))
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: effectivePrice(p),
        image: p.images[0] ?? "",
      }));
  }

  async adminList(params: AdminProductListParams = {}): Promise<ProductListResult> {
    const { search, category, status, stockStatus, featured, page = 1, pageSize = 20 } = params;

    let filtered = [...this.products];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (status === "published") {
      filtered = filtered.filter((p) => p.published);
    } else if (status === "draft") {
      filtered = filtered.filter((p) => !p.published);
    }
    if (stockStatus) {
      filtered = filtered.filter((p) => p.stockStatus === stockStatus);
    }
    if (featured) {
      filtered = filtered.filter((p) => p.featured);
    }
    if (search?.trim()) {
      filtered = filtered.filter((p) => this.matchesSearch(p, search.trim()));
    }

    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return paginate(filtered, page, pageSize);
  }

  async adminGetById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async create(input: ProductWriteInput): Promise<Product> {
    if (this.products.some((p) => p.slug === input.slug)) {
      throw new Error(`A product with slug "${input.slug}" already exists.`);
    }

    const now = new Date().toISOString();
    const product: Product = {
      id: `prod-${Math.random().toString(36).slice(2, 10)}`,
      ...input,
      tags: [],
      isPlaceholder: false,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(product);
    return product;
  }

  async update(id: string, input: Partial<ProductWriteInput>): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    if (input.slug && this.products.some((p) => p.id !== id && p.slug === input.slug)) {
      throw new Error(`A product with slug "${input.slug}" already exists.`);
    }

    const updated: Product = {
      ...this.products[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.products[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id);
  }

  async getStats(): Promise<ProductStats> {
    const total = this.products.length;
    const published = this.products.filter((p) => p.published).length;
    const featured = this.products.filter((p) => p.featured).length;
    const lowStock = this.products.filter((p) => p.stockStatus === "low-stock").length;
    const recent = [...this.products]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, RECENT_PRODUCTS_LIMIT);

    return { total, published, draft: total - published, featured, lowStock, recent };
  }
}

/**
 * Active repository instance used throughout the app. Swapping the data
 * source later (e.g. to Postgres via Prisma) means writing a new class that
 * implements `ProductRepository` and changing only this export.
 */
export const productRepository: ProductRepository = new InMemoryProductRepository(
  PRODUCTS,
);
