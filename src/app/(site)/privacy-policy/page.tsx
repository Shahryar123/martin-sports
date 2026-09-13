import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, Body } from "@/components/ui/typography";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
  noIndex: true,
});

export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-20">
      <PageHeading>Privacy Policy</PageHeading>
      <Body className="mt-4">
        Martin Sports&apos; full privacy policy will be published here before
        launch.
      </Body>
    </Container>
  );
}
