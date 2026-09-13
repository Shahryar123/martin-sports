import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, Body } from "@/components/ui/typography";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Martin Sports by WhatsApp, phone or email — order cricket gear or ask about sizing and availability.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-20">
      <PageHeading>Contact Us</PageHeading>
      <Body className="mt-2">
        The fastest way to order or ask about sizing/availability is
        WhatsApp. A structured order-inquiry form is coming in the next
        build phase.
      </Body>

      <div className="mt-8 space-y-4">
        <WhatsAppButton
          variant="outline"
          size="lg"
          label={`${SITE_CONFIG.contact.phone} (WhatsApp)`}
          className="w-full justify-start"
        />
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <Mail className="size-5 text-brand" />
          <span className="text-sm text-foreground">{SITE_CONFIG.contact.email}</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <MapPin className="size-5 text-brand" />
          <span className="text-sm text-foreground">{SITE_CONFIG.contact.address}</span>
        </div>
      </div>
    </Container>
  );
}
