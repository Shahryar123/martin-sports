import type { Metadata } from "next";
import { productRepository } from "@/lib/repositories/product-repository";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { testimonialRepository } from "@/lib/repositories/testimonial-repository";
import { contentRepository } from "@/lib/repositories/content-repository";
import { buildMetadata } from "@/lib/seo";

import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { AmbassadorsSection } from "@/components/home/ambassadors-section";
import { FounderSection } from "@/components/home/founder-section";
import { WhySection } from "@/components/home/why-section";
import { DeliverySection } from "@/components/home/delivery-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhatsAppCtaSection } from "@/components/home/whatsapp-cta-section";

export const metadata: Metadata = buildMetadata({
  title: "Cricket Gear Built for the Game",
  description:
    "Shop cricket bats, balls, protective gear, footwear and accessories from Martin Sports — a Pakistan-based cricket equipment brand with nationwide Cash on Delivery.",
  path: "/",
});

export default async function HomePage() {
  const [featured, ambassadors, owner, testimonials, homepage] = await Promise.all([
    productRepository.getFeatured(4),
    ambassadorRepository.list(),
    ambassadorRepository.getOwnerProfile(),
    testimonialRepository.list(),
    contentRepository.getHomepage(),
  ]);

  return (
    <div>
      <HeroSection homepage={homepage} />
      <CategoryGrid />
      <FeaturedProductsSection products={featured} priorityCount={2} />
      <AmbassadorsSection ambassadors={ambassadors} />
      <FounderSection owner={owner} />
      <WhySection />
      <DeliverySection />
      <TestimonialsSection testimonials={testimonials} />
      <WhatsAppCtaSection />
    </div>
  );
}
