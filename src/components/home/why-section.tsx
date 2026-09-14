import Image from "next/image";
import {
  Trophy,
  ShieldCheck,
  Truck,
  Banknote,
  MessageCircle,
  Headset,
} from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { Body, ProductHeading } from "@/components/ui/typography";

const DIFFERENTIATORS = [
  {
    icon: Trophy,
    title: "Cricket-Focused Expertise",
    description:
      "Backed by real coaching experience at PIA Sports Complex, Karachi not a generic sporting-goods catalog.",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description:
      "Equipment selected for durability and match-day performance, not just a low price tag.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "We deliver across Pakistan, wherever the game takes you.",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description:
      "Pay only when your order arrives at your door, no online payment required.",
  },
  {
    icon: MessageCircle,
    title: "Easy WhatsApp Ordering",
    description: "No account, no checkout forms, just message us to order.",
  },
  {
    icon: Headset,
    title: "Direct & Personal Service",
    description:
      "Real answers on sizing, availability and orders from a real person.",
  },
];

export function WhySection() {
  return (
    <Section className="relative overflow-hidden">
      <Image
        src="/banner-why.avif"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/35 to-background/55" />

      <div className="relative z-10">
        <Reveal>
          <SectionHeader
            eyebrow="Why Martin Sports"
            title="Built Around the Game"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map(({ icon: Icon, title, description }, i) => (
            <Reveal
              key={title}
              delay={i * 0.05}
              className="rounded-xl border border-border/40 bg-card/50 p-6 shadow-lg backdrop-blur-md transition-colors hover:bg-card/65"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <ProductHeading as="h3" className="mt-4 text-base sm:text-lg">
                {title}
              </ProductHeading>
              <Body className="mt-1.5 text-foreground/80">{description}</Body>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
