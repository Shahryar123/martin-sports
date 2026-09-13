import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeading, Body } from "@/components/ui/typography";
import { ProductCard } from "@/components/products/product-card";
import { productRepository } from "@/lib/repositories/product-repository";
import { getCategoryName, CATEGORIES } from "@/lib/constants/categories";
import type { CategorySlug } from "@/lib/constants/categories";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop All Products",
  path: "/products",
});

type Props = {
  searchParams: Promise<{
    category?: string;
    categories?: string; // comma-separated CategorySlug[], for grouped homepage links (e.g. "Gloves", "Protection")
    label?: string; // override heading when `categories` spans a group that has no single category name
    search?: string;
  }>;
};

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

/**
 * Minimal listing for this phase — proves the repository/filter contract end
 * to end, and gives the header's search box, category dropdown, and the
 * homepage's category/CTA links a real destination. Sort controls, price
 * filters and pagination UI are built out in the next phase (the repository
 * already supports all of it).
 */
export default async function ProductsPage({ searchParams }: Props) {
  const { category, categories, label, search } = await searchParams;

  const categorySlug = category && isCategorySlug(category) ? category : undefined;
  const categorySlugs = categories
    ?.split(",")
    .map((c) => c.trim())
    .filter(isCategorySlug);

  const { items } = await productRepository.list({
    pageSize: 100,
    category: categorySlug,
    categories: categorySlugs?.length ? categorySlugs : undefined,
    search,
  });

  const heading =
    label ?? (categorySlug ? getCategoryName(categorySlug) : "Shop All Products");

  return (
    <Container className="py-12 sm:py-16">
      <PageHeading>{heading}</PageHeading>
      <Body className="mt-2">
        {items.length} product{items.length === 1 ? "" : "s"}
        {search && ` matching "${search}"`} · filtering and sorting arrive in
        the next build phase.
      </Body>

      {items.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No products found"
          description="Try a different search term or browse all products."
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
