import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { MotionPress } from "@/components/shared/motion-press";
import { HeroHeading, Body } from "@/components/ui/typography";
import { ProductCard } from "@/components/products/product-card";
import { productRepository } from "@/lib/repositories/product-repository";
import { SITE_CONFIG } from "@/lib/constants/site";

const TRUST_POINTS = [
  { icon: Truck, label: "Nationwide Delivery", desc: "Across Pakistan" },
  { icon: Banknote, label: "Cash on Delivery", desc: "Pay when it arrives" },
  { icon: ShieldCheck, label: "Trusted by Trainers", desc: "PIA Sports Complex, Karachi" },
];

export default async function HomePage() {
  const featured = await productRepository.getFeatured(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-1/60 via-background to-background" />
        <Container className="relative py-24 lg:py-32">
          <Badge variant="secondary" className="mb-6">
            Nationwide Delivery · Cash on Delivery
          </Badge>
          <HeroHeading className="max-w-2xl">
            Cricket gear built for the game.
          </HeroHeading>
          <Body className="mt-6 max-w-xl text-base sm:text-lg">
            {SITE_CONFIG.description}
          </Body>
          <div className="mt-10 flex flex-wrap gap-4">
            <MotionPress>
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop the Collection
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </MotionPress>
            <MotionPress>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">About Martin Sports</Link>
              </Button>
            </MotionPress>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-surface-0">
        <Container className="py-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TRUST_POINTS.map(({ icon: Icon, label, desc }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md border border-border bg-surface-1">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="The Collection"
            title="Featured Products"
            description="Placeholder catalog — real product photography and details coming soon."
            action={
              <Link
                href="/products"
                className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
              >
                View all <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
