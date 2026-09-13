import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { MotionPress } from "@/components/shared/motion-press";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { HeroHeading, Body } from "@/components/ui/typography";
import { HeroGraphic } from "@/components/home/hero-graphic";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-1/60 via-background to-background" />
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:gap-8 lg:py-28">
        <div>
          <Badge variant="secondary" className="mb-6">
            Nationwide Delivery · Cash on Delivery
          </Badge>
          <HeroHeading>Built for the Game. Trusted by Cricketers.</HeroHeading>
          <Body className="mt-6 max-w-xl text-base sm:text-lg">
            Martin Sports is a Pakistan-based cricket equipment brand — bats,
            balls, protective gear, footwear and accessories chosen with real
            coaching experience behind them, delivered nationwide with Cash
            on Delivery.
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
              <WhatsAppButton variant="outline" size="lg" label="Order via WhatsApp" />
            </MotionPress>
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroGraphic />
        </div>
      </Container>
    </section>
  );
}
