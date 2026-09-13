import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { MotionPress } from "@/components/shared/motion-press";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SectionHeading, Body } from "@/components/ui/typography";

export function WhatsAppCtaSection() {
  return (
    <Section>
      <Reveal>
        <div className="rounded-xl border border-brand/20 bg-gradient-to-br from-surface-1 to-surface-0 px-6 py-14 text-center sm:px-12">
          <SectionHeading as="h2">Ready to Gear Up?</SectionHeading>
          <Body className="mx-auto mt-3 max-w-lg">
            Message us on WhatsApp for sizing help, availability, or to place
            your order directly — no account or checkout required.
          </Body>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MotionPress>
              <WhatsAppButton size="lg" />
            </MotionPress>
            <Link
              href="/shop"
              className="text-sm font-medium text-foreground-secondary hover:text-foreground hover:underline"
            >
              or browse all products
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
