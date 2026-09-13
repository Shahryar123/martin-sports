import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ProductGrid } from "@/components/shop/product-grid";
import { productRepository } from "@/lib/repositories/product-repository";
import { getCategoryName } from "@/lib/constants/categories";
import { buildListParams, getSelectedCategories, type ShopSearchParams } from "@/lib/shop/params";
import { buildMetadata } from "@/lib/seo";

const PAGE_SIZE = 12;

type Props = {
  searchParams: Promise<ShopSearchParams>;
};

/**
 * Shop is one route serving many facets (category, search, price, stock,
 * sort, page) via query params. To avoid duplicate-content across the
 * combinatorial filter permutations while still giving genuinely distinct
 * content (a single category) its own indexable, canonical URL:
 * - a search query is `noindex` (thin/volatile results page, standard
 *   practice — not something worth ranking on its own),
 * - exactly one selected category gets a category-specific title/
 *   description and canonicals to its own clean `/shop?category=<slug>`,
 * - everything else (no filters, or a multi-filter/sort/price combination)
 *   canonicalizes back to the plain `/shop` listing.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const rawParams = await searchParams;
  const selectedCategories = getSelectedCategories(rawParams);
  const singleCategory = selectedCategories.length === 1 ? selectedCategories[0] : null;

  if (rawParams.search) {
    return buildMetadata({
      title: `Search Results for "${rawParams.search}"`,
      description: `Products matching "${rawParams.search}" at Martin Sports.`,
      path: "/shop",
      noIndex: true,
    });
  }

  if (singleCategory) {
    const categoryName = rawParams.label ?? getCategoryName(singleCategory);
    return buildMetadata({
      title: categoryName,
      description: `Shop ${categoryName} at Martin Sports — nationwide delivery across Pakistan with Cash on Delivery.`,
      path: `/shop?category=${singleCategory}`,
    });
  }

  return buildMetadata({
    title: "Shop All Products",
    description:
      "Browse the full Martin Sports catalog — cricket bats, balls, protective gear, footwear and accessories, with nationwide Cash on Delivery.",
    path: "/shop",
  });
}

export default async function ShopPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const filters = buildListParams(rawParams);

  const [{ items, total }, priceBounds] = await Promise.all([
    productRepository.list({ ...filters, page: 1, pageSize: PAGE_SIZE }),
    productRepository.getPriceBounds(),
  ]);

  const selectedCategories = getSelectedCategories(rawParams);
  const heading =
    rawParams.label ??
    (selectedCategories.length === 1 ? getCategoryName(selectedCategories[0]) : "Shop All Products");

  const filterKey = new URLSearchParams(
    Object.entries(rawParams).filter((entry): entry is [string, string] => !!entry[1]),
  ).toString();

  return (
    <Container className="py-12 sm:py-16">
      <PageHeading>{heading}</PageHeading>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ShopFilters priceBounds={priceBounds} />
        </aside>

        <div>
          <ShopToolbar total={total} priceBounds={priceBounds} />

          {items.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try a different search term, or clear your filters to see everything we carry."
              action={
                <Button asChild variant="outline">
                  <Link href="/shop">Clear Filters</Link>
                </Button>
              }
            />
          ) : (
            <ProductGrid
              key={filterKey}
              initialItems={items}
              initialTotal={total}
              pageSize={PAGE_SIZE}
              filters={filters}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
