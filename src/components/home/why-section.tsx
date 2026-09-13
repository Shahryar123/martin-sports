import { Trophy, ShieldCheck, Truck, Banknote, MessageCircle, Headset } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { Body } from "@/components/ui/typography";

const DIFFERENTIATORS = [
  {
    icon: Trophy,
    title: "Cricket-Focused Expertise",
    description: "Backed by real coaching experience at PIA Sports Complex, Karachi — not a generic sporting-goods catalog.",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description: "Equipment selected for durability and match-day performance, not just a low price tag.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "We deliver across Pakistan, wherever the game takes you.",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description: "Pay only when your order arrives at your door — no online payment required.",
  },
  {
    icon: MessageCircle,
    title: "Easy WhatsApp Ordering",
    description: "No account, no checkout forms — just message us to order.",
  },
  {
    icon: Headset,
    title: "Direct & Personal Service",
    description: "Real answers on sizing, availability and orders from a real person.",
  },
];

export function WhySection() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Why Martin Sports" title="Built Around the Game" />
      </Reveal>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {DIFFERENTIATORS.map(({ icon: Icon, title, description }, i) => (
          <Reveal key={title} delay={i * 0.05} className="bg-card p-6">
            <Icon className="size-6 text-brand" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
            <Body className="mt-1.5 text-sm">{description}</Body>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
