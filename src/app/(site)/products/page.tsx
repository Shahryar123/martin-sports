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
  searchParams: Promise<{ category?: string; search?: string }>;
};

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

/**
 * Minimal listing for this phase — proves the repository/filter contract end
 * to end, and gives the header's search box and category dropdown a real
 * destination. Sort controls, price filters and pagination UI are built out
 * in the next phase (the repository already supports all of it).
 */
export default async function ProductsPage({ searchParams }: Props) {
  const { category, search } = await searchParams;
  const categorySlug = category && isCategorySlug(category) ? category : undefined;

  const { items } = await productRepository.list({
    pageSize: 100,
    category: categorySlug,
    search,
  });

  const heading = categorySlug ? getCategoryName(categorySlug) : "Shop All Products";

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
