import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Contact Us
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The fastest way to order or ask about sizing/availability is
        WhatsApp. A structured order-inquiry form is coming in the next
        build phase.
      </p>

      <div className="mt-8 space-y-4">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
        >
          <MessageCircle className="size-5 text-primary" />
          <span className="text-sm text-foreground">{SITE_CONFIG.contact.phone} (WhatsApp)</span>
        </a>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <Mail className="size-5 text-primary" />
          <span className="text-sm text-foreground">{SITE_CONFIG.contact.email}</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <MapPin className="size-5 text-primary" />
          <span className="text-sm text-foreground">{SITE_CONFIG.contact.address}</span>
        </div>
      </div>
    </div>
  );
}
