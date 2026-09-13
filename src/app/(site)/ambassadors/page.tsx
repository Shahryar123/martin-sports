import type { Metadata } from "next";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, ProductHeading, Body, Metadata as MetaText } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "Brand Ambassadors",
  path: "/ambassadors",
});

export default async function AmbassadorsPage() {
  const ambassadors = await ambassadorRepository.list();

  return (
    <Container className="max-w-5xl py-16 sm:py-20">
      <PageHeading>Brand Ambassadors</PageHeading>
      <Body className="mt-2">
        Placeholder profiles — real ambassador details coming soon.
      </Body>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ambassadors.map((ambassador) => (
          <div
            key={ambassador.id}
            className="rounded-lg border border-border bg-card p-6"
          >
            <ProductHeading as="h2">{ambassador.name}</ProductHeading>
            <MetaText className="mt-1 block text-brand normal-case">
              {ambassador.role}
            </MetaText>
            <Body className="mt-3">{ambassador.bio}</Body>
          </div>
        ))}
      </div>
    </Container>
  );
}
