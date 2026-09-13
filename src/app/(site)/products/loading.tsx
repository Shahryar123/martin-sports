import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-4 w-40" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
