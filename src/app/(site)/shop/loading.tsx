import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";

export default function ShopLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <Skeleton className="h-9 w-64" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-6 lg:block">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div>
          <Skeleton className="mb-6 h-5 w-32" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
