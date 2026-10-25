import Image from "next/image";
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
        <div className="relative overflow-hidden rounded-xl border border-brand/30 px-6 py-14 text-center sm:px-12">
          <Image
            src="/banner-home.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />

          {/* The banner photo is dark, so this card borrows the
              header/footer's cream-on-dark token override instead of the
              page's usual dark-green-on-cream text. */}
          <div className="theme-forest relative text-foreground">
            <SectionHeading as="h2">Ready to Gear Up?</SectionHeading>
            <Body className="mx-auto mt-3 max-w-lg">
              Message us on WhatsApp for sizing help, availability, or to
              place your order directly — no account or checkout required.
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
        </div>
      </Reveal>
    </Section>
  );
}
