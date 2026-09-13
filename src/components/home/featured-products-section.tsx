import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";

type FeaturedProductsSectionProps = {
  products: Product[];
  /** How many of the first cards to eagerly load/prioritize — this section
   * renders high on the homepage, so its first couple of images are
   * plausible LCP candidates. */
  priorityCount?: number;
};

export function FeaturedProductsSection({ products, priorityCount = 0 }: FeaturedProductsSectionProps) {
  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="The Collection"
          title="Featured Products"
          description="Placeholder catalog — real product photography and details coming soon."
          action={
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.06}>
            <ProductCard product={product} priority={i < priorityCount} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
