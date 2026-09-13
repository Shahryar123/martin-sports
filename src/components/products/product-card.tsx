import Link from "next/link";
import { ProductImage } from "@/components/products/product-image";
import { PriceDisplay } from "@/components/shared/price-display";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductHeading, Metadata, Caption } from "@/components/ui/typography";
import { getCategoryName } from "@/lib/constants/categories";
import { SITE_CONFIG } from "@/lib/constants/site";
import type { Product } from "@/types";

/**
 * The card's own link and the quick WhatsApp-order action are siblings
 * (not nested) — an <a> inside another <a> is invalid HTML and would break
 * the WhatsApp button's own href, so the card wraps only the image/title,
 * not the whole tile.
 */
export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand/40">
      <Link
        href={href}
        className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ProductImage
          images={product.images}
          name={product.name}
          category={product.category}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge variant={product.inStock ? "success" : "warning"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
          {hasDiscount && <Badge>Sale</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Metadata>{getCategoryName(product.category)}</Metadata>
        <Link
          href={href}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ProductHeading className="mt-1 line-clamp-2 text-sm font-medium sm:text-base">
            {product.name}
          </ProductHeading>
        </Link>
        <Caption className="mt-0.5">by {SITE_CONFIG.name}</Caption>
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
          className="mt-2"
        />

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Button asChild variant="outline" size="sm" className="h-11 flex-1">
            <Link href={href}>View Details</Link>
          </Button>
          <WhatsAppButton
            variant="icon"
            items={[
              {
                productId: product.id,
                productSlug: product.slug,
                productName: product.name,
                unitPrice: product.price,
                quantity: 1,
                image: product.images[0] ?? "",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
