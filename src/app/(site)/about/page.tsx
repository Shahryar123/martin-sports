import type { Metadata } from "next";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, SectionHeading, Body, Metadata as MetaText } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "About Martin Sports",
  path: "/about",
});

export default async function AboutPage() {
  const owner = await ambassadorRepository.getOwnerProfile();

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <PageHeading>About Martin Sports</PageHeading>
      <Body className="mt-4">
        Martin Sports is a Pakistan-based cricket equipment brand. Full brand
        story content is coming soon.
      </Body>

      <div id="abdul-qayyum" className="mt-12 scroll-mt-24 border-t border-border pt-8">
        <SectionHeading as="h2" className="text-xl sm:text-2xl">
          {owner.name}
        </SectionHeading>
        <MetaText className="mt-1 block text-brand normal-case">{owner.role}</MetaText>
        <Body className="mt-1">{owner.affiliation}</Body>
        <div className="mt-4 space-y-3">
          {owner.bio.map((paragraph) => (
            <Body key={paragraph}>{paragraph}</Body>
          ))}
        </div>
      </div>
    </Container>
  );
}
