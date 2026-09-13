import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/shared/container";
import { PageHeading } from "@/components/ui/typography";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Cart",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PageHeading as="h1" className="mb-8">
        Your Cart
      </PageHeading>
      <CartView />
    </Container>
  );
}
