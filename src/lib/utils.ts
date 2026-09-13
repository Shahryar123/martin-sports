export { cn } from "cn";

/** Turns free text into a URL-safe slug: lowercase, alphanumeric words
 * joined by single hyphens. Used by admin create forms' "generate from
 * name" affordance for product/category/ambassador slugs. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
