import Link from "next/link";
import { ProductImage } from "@/components/products/product-image";
import { PriceDisplay } from "@/components/shared/price-display";
import { Badge } from "@/components/ui/badge";
import { ProductHeading, Metadata } from "@/components/ui/typography";
import { getCategoryName } from "@/lib/constants/categories";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative">
        <ProductImage
          images={product.images}
          name={product.name}
          category={product.category}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {!product.inStock && (
          <Badge variant="warning" className="absolute top-3 left-3">
            Out of Stock
          </Badge>
        )}
      </div>
      <div className="p-4">
        <Metadata>{getCategoryName(product.category)}</Metadata>
        <ProductHeading className="mt-1 line-clamp-2 text-sm font-medium sm:text-base">
          {product.name}
        </ProductHeading>
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
          className="mt-2"
        />
      </div>
    </Link>
  );
}
