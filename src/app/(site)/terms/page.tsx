import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, Body } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  path: "/terms",
  noIndex: true,
});

export default function TermsPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-20">
      <PageHeading>Terms of Service</PageHeading>
      <Body className="mt-4">
        Martin Sports&apos; full terms of service will be published here
        before launch.
      </Body>
    </Container>
  );
}
