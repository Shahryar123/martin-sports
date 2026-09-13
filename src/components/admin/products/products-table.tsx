"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Sparkles, TrendingUp, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/products/product-image";
import { PublishedBadge, StockStatusBadge } from "@/components/admin/status-badge";
import { ProductFlagToggle } from "@/components/admin/products/product-flag-toggle";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProductAction } from "@/lib/actions/admin-products";
import { formatPKR } from "@/lib/currency";
import { getCategoryName } from "@/lib/constants/categories";
import type { Product } from "@/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Collections</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ProductImage
                    images={product.images}
                    name={product.name}
                    category={product.category}
                    className="size-10 shrink-0 rounded-md"
                    sizes="40px"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getCategoryName(product.category)}
              </TableCell>
              <TableCell>
                {product.salePrice ? (
                  <div>
                    <span className="text-foreground">{formatPKR(product.salePrice)}</span>{" "}
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPKR(product.price)}
                    </span>
                  </div>
                ) : (
                  formatPKR(product.price)
                )}
              </TableCell>
              <TableCell>
                <StockStatusBadge status={product.stockStatus} />
              </TableCell>
              <TableCell>
                <PublishedBadge published={product.published} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-0.5">
                  <ProductFlagToggle
                    productId={product.id}
                    flag="featured"
                    value={product.featured}
                    icon={Star}
                    activeLabel="Featured — click to unfeature"
                    inactiveLabel="Mark as featured"
                  />
                  <ProductFlagToggle
                    productId={product.id}
                    flag="isNew"
                    value={product.isNew}
                    icon={Sparkles}
                    activeLabel="Marked new — click to unmark"
                    inactiveLabel="Mark as new"
                  />
                  <ProductFlagToggle
                    productId={product.id}
                    flag="bestSeller"
                    value={product.bestSeller}
                    icon={TrendingUp}
                    activeLabel="Best seller — click to unmark"
                    inactiveLabel="Mark as best seller"
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="icon-sm" aria-label="Edit product">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Delete product">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    }
                    title="Delete this product?"
                    description={`"${product.name}" will be permanently removed. This can't be undone.`}
                    confirmLabel="Delete"
                    onConfirm={() => deleteProductAction(product.id)}
                    onSuccess={() => router.refresh()}
                    successMessage="Product deleted"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
