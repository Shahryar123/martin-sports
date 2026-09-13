import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, Body } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "Delivery & Cash on Delivery",
  description:
    "Martin Sports delivers cricket gear nationwide across Pakistan with Cash on Delivery — pay when your order arrives.",
  path: "/delivery",
});

export default function DeliveryPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-20">
      <PageHeading>Delivery &amp; Cash on Delivery</PageHeading>
      <Body className="mt-4">
        Martin Sports delivers nationwide across Pakistan with Cash on
        Delivery — pay when your order arrives. Detailed delivery timelines
        and coverage information will be published here.
      </Body>
    </Container>
  );
}
