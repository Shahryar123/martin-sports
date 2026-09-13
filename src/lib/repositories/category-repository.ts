import { CATEGORY_RECORDS } from "@/lib/data/categories";
import type { Category } from "@/types";

export type CategoryCreateInput = {
  slug: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
  published: boolean;
};

export type CategoryUpdateInput = Partial<CategoryCreateInput>;

/**
 * Contract for category data access. `list`/`getBySlug` are the public,
 * published-only read path; the `admin*` methods see every category
 * (including unpublished) and are the only way to mutate the catalog of
 * categories. See ARCHITECTURE.md ("Categories") and
 * `lib/repositories/product-repository.ts` for the same public/admin split.
 */
export interface CategoryRepository {
  list(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;

  adminList(): Promise<Category[]>;
  adminGetById(id: string): Promise<Category | null>;
  create(input: CategoryCreateInput): Promise<Category>;
  update(id: string, input: CategoryUpdateInput): Promise<Category>;
  delete(id: string): Promise<void>;
  setPublished(id: string, published: boolean): Promise<Category>;
}

function bySortOrder(a: Category, b: Category): number {
  return a.sortOrder - b.sortOrder;
}

class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Category[];

  constructor(seed: Category[]) {
    this.categories = [...seed];
  }

  async list(): Promise<Category[]> {
    return this.categories.filter((c) => c.published).sort(bySortOrder);
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return this.categories.find((c) => c.slug === slug && c.published) ?? null;
  }

  async adminList(): Promise<Category[]> {
    return [...this.categories].sort(bySortOrder);
  }

  async adminGetById(id: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id) ?? null;
  }

  async create(input: CategoryCreateInput): Promise<Category> {
    if (this.categories.some((c) => c.slug === input.slug)) {
      throw new Error(`A category with slug "${input.slug}" already exists.`);
    }

    const now = new Date().toISOString();
    const category: Category = {
      id: `cat-${input.slug}-${Math.random().toString(36).slice(2, 8)}`,
      ...input,
      isPlaceholder: false,
      createdAt: now,
      updatedAt: now,
    };
    this.categories.push(category);
    return category;
  }

  async update(id: string, input: CategoryUpdateInput): Promise<Category> {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    if (input.slug && this.categories.some((c) => c.id !== id && c.slug === input.slug)) {
      throw new Error(`A category with slug "${input.slug}" already exists.`);
    }

    const updated: Category = {
      ...this.categories[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.categories[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.categories = this.categories.filter((c) => c.id !== id);
  }

  async setPublished(id: string, published: boolean): Promise<Category> {
    return this.update(id, { published });
  }
}

/**
 * Active repository instance. See ARCHITECTURE.md ("Path to a real
 * database") — swapping to a DB-backed implementation means writing a new
 * class satisfying `CategoryRepository` and changing only this export.
 */
export const categoryRepository: CategoryRepository = new InMemoryCategoryRepository(
  CATEGORY_RECORDS,
);
