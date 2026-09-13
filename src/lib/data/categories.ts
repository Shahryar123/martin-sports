import { CATEGORIES } from "@/lib/constants/categories";
import type { Category } from "@/types";

const SEED_TIMESTAMP = "2025-01-01T00:00:00.000Z";

/**
 * Seed data for the admin-managed Category entities — one per taxonomy slug
 * in `lib/constants/categories.ts`, with empty description/image so the
 * admin has something to fill in. See ARCHITECTURE.md ("Categories").
 */
export const CATEGORY_RECORDS: Category[] = CATEGORIES.map((category, index) => ({
  id: `cat-${category.slug}`,
  slug: category.slug,
  name: category.name,
  description: "",
  image: "",
  sortOrder: index,
  published: true,
  isPlaceholder: true,
  createdAt: SEED_TIMESTAMP,
  updatedAt: SEED_TIMESTAMP,
}));
