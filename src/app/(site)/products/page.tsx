import Link from "next/link";
import type { Metadata } from "next";
import { ProductImage } from "@/components/products/product-image";
import { productRepository } from "@/lib/repositories/product-repository";
import { getCategoryName } from "@/lib/constants/categories";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop All Products",
  path: "/products",
});

/**
 * Minimal listing for this phase — proves the repository/filter contract end
 * to end. Search, category filters, sort controls and pagination UI are
 * built out in the next phase (the repository already supports all of it).
 */
export default async function ProductsPage() {
  const { items } = await productRepository.list({ pageSize: 100 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Shop All Products
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {items.length} products · filtering and sorting arrive in the next
        build phase.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40"
          >
            <ProductImage
              images={product.images}
              name={product.name}
              category={product.category}
              className="aspect-square w-full"
            />
            <div className="p-4">
              <p className="text-xs text-muted-foreground">
                {getCategoryName(product.category)}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                {product.name}
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                Rs. {product.price.toLocaleString("en-PK")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
