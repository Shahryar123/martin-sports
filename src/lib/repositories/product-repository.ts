import { PRODUCTS } from "@/lib/data/products";
import type {
  Product,
  ProductListParams,
  ProductListResult,
} from "@/types";

/**
 * Contract every product data source must satisfy. Route/page/component code
 * should depend only on this interface (via `productRepository` below), never
 * on `PRODUCTS` or a specific implementation directly — that's what makes it
 * possible to swap in a real database later without touching call sites.
 *
 * All methods are async so a future DB/ORM-backed implementation is a
 * drop-in replacement.
 */
export interface ProductRepository {
  list(params?: ProductListParams): Promise<ProductListResult>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getFeatured(limit?: number): Promise<Product[]>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
  getAllSlugs(): Promise<string[]>;
}

const DEFAULT_PAGE_SIZE = 24;

function sortProducts(products: Product[], sort: ProductListParams["sort"]) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
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

/**
 * In-memory implementation backed by the placeholder seed data in
 * `lib/data/products.ts`. See ARCHITECTURE.md ("Data layer") for the plan to
 * replace this with a database-backed implementation.
 */
class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  async list(params: ProductListParams = {}): Promise<ProductListResult> {
    const {
      category,
      categories,
      minPrice,
      maxPrice,
      inStockOnly,
      search,
      tags,
      sort = "featured",
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = params;

    let filtered = this.products;

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (categories?.length) {
      filtered = filtered.filter((p) => categories.includes(p.category));
    }
    if (typeof minPrice === "number") {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (typeof maxPrice === "number") {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }
    if (tags?.length) {
      filtered = filtered.filter((p) => tags.some((t) => p.tags.includes(t)));
    }
    if (search?.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    const sorted = sortProducts(filtered, sort);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return { items, total, page: currentPage, pageSize, totalPages };
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return this.products.find((p) => p.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async getFeatured(limit = 8): Promise<Product[]> {
    return this.products.filter((p) => p.featured).slice(0, limit);
  }

  async getRelated(product: Product, limit = 4): Promise<Product[]> {
    return this.products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }

  async getAllSlugs(): Promise<string[]> {
    return this.products.map((p) => p.slug);
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
