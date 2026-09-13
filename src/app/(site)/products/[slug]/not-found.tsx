import Link from "next/link";
import { PackageX } from "lucide-react";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <Container className="py-16 sm:py-20">
      <EmptyState
        icon={PackageX}
        title="Product not found"
        description="This product may have been removed or the link is incorrect."
        action={
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        }
      />
    </Container>
  );
}
