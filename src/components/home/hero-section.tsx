import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { MotionPress } from "@/components/shared/motion-press";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { HeroHeading, Body } from "@/components/ui/typography";
import { HeroGraphic } from "@/components/home/hero-graphic";
import { cn } from "@/lib/utils";
import type { HomepageContent } from "@/types";

export function HeroSection({ homepage }: { homepage: HomepageContent }) {
  const hasImage = Boolean(homepage.heroImage);

  return (
    <section className="relative overflow-hidden">
      {hasImage ? (
        <Image
          src={homepage.heroImage}
          alt="Martin Sports premium cricket gear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-surface-1/60 via-background to-background" />
      )}

      <Container
        className={cn(
          "relative pb-20 pt-10 lg:pb-28 lg:pt-14",
          hasImage
            ? "min-h-[420px] sm:min-h-[480px] lg:min-h-[600px]"
            : "grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8",
        )}
      >
        {/* The banner photo's own background is already this brand's deep
            forest green, so the text column borrows the header/footer's
            dark-chrome token override to read as cream-on-green instead of
            the page's usual dark-green-on-cream. */}
        <div className={cn(hasImage && "theme-forest flex h-full max-w-xl flex-col justify-center text-foreground")}>
          <Badge variant="secondary" className="mb-6">
            Nationwide Delivery · Cash on Delivery
          </Badge>
          <HeroHeading>{homepage.heroHeading}</HeroHeading>
          <Body className="mt-6 max-w-xl text-base sm:text-lg">
            {homepage.heroSubheading}
          </Body>
          <div className="mt-10 flex flex-wrap gap-4">
            <MotionPress>
              <Button size="lg" asChild>
                <Link href={homepage.heroCtaHref}>
                  {homepage.heroCtaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </MotionPress>
            <MotionPress>
              <WhatsAppButton variant="outline" size="lg" label="Order via WhatsApp" />
            </MotionPress>
          </div>
        </div>

        {!hasImage && (
          <div className="hidden lg:block">
            <HeroGraphic />
          </div>
        )}
      </Container>
    </section>
  );
}
