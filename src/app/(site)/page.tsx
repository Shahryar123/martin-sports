import { productRepository } from "@/lib/repositories/product-repository";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { testimonialRepository } from "@/lib/repositories/testimonial-repository";

import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { AmbassadorsSection } from "@/components/home/ambassadors-section";
import { FounderSection } from "@/components/home/founder-section";
import { WhySection } from "@/components/home/why-section";
import { DeliverySection } from "@/components/home/delivery-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhatsAppCtaSection } from "@/components/home/whatsapp-cta-section";

export default async function HomePage() {
  const [featured, ambassadors, owner, testimonials] = await Promise.all([
    productRepository.getFeatured(4),
    ambassadorRepository.list(),
    ambassadorRepository.getOwnerProfile(),
    testimonialRepository.list(),
  ]);

  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProductsSection products={featured} />
      <AmbassadorsSection ambassadors={ambassadors} />
      <FounderSection owner={owner} />
      <WhySection />
      <DeliverySection />
      <TestimonialsSection testimonials={testimonials} />
      <WhatsAppCtaSection />
    </div>
  );
}
