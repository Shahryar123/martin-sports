import { Star } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { Caption } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Customer Feedback"
          title="What Customers Say"
          description="Illustrative examples for now — real customer reviews will replace these before launch."
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {testimonials.map((testimonial, i) => (
          <Reveal key={testimonial.id} delay={i * 0.06}>
            <figure className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={cn(
                      "size-3.5",
                      starIndex < testimonial.rating
                        ? "fill-brand text-brand"
                        : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground-secondary">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-foreground">
                {testimonial.authorName}
                <span className="ml-1 font-normal text-muted-foreground">
                  · {testimonial.authorLocation}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Caption className="mt-6 text-center">
        Placeholder testimonials shown for layout purposes only.
      </Caption>
    </Section>
  );
}
