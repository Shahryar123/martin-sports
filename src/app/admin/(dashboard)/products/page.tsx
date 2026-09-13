import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { productRepository } from "@/lib/repositories/product-repository";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ProductsFilters } from "@/components/admin/products/products-filters";
import { ProductsTable } from "@/components/admin/products/products-table";
import type { Product } from "@/types";

type SearchParams = Record<string, string | undefined>;

type Props = {
  searchParams: Promise<SearchParams>;
};

const PAGE_SIZE = 20;

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const [{ items, total, totalPages }, categories] = await Promise.all([
    productRepository.adminList({
      search: params.search,
      category: params.category,
      status: params.status === "published" || params.status === "draft" ? params.status : undefined,
      stockStatus:
        params.stockStatus === "in-stock" ||
        params.stockStatus === "low-stock" ||
        params.stockStatus === "out-of-stock"
          ? (params.stockStatus as Product["stockStatus"])
          : undefined,
      featured: params.featured === "1",
      page,
      pageSize: PAGE_SIZE,
    }),
    categoryRepository.adminList(),
  ]);

  function buildHref(nextPage: number) {
    const next = new URLSearchParams(
      Object.entries(params).filter((e): e is [string, string] => !!e[1]),
    );
    next.set("page", String(nextPage));
    return `/admin/products?${next.toString()}`;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description={`${total} product${total === 1 ? "" : "s"} in the catalog.`}
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="size-4" /> New Product
            </Link>
          </Button>
        }
      />

      <ProductsFilters categories={categories} />

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters, or create a new product."
          action={
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="size-4" /> New Product
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <ProductsTable products={items} />
          <AdminPagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </>
      )}
    </div>
  );
}
