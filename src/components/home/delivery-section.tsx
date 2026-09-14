import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading, Body, Metadata } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot",
  "Gujranwala", "and beyond",
];

export function DeliverySection() {
  return (
    <Section surface="muted">
      <Reveal>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Metadata className="text-brand">Nationwide Coverage</Metadata>
            <SectionHeading as="h2" className="mt-2">
              Nationwide Delivery Across Pakistan
            </SectionHeading>
            <Body className="mt-4 max-w-lg">
              Wherever you play, we deliver from major cities to smaller
              towns across the country. Every order ships with Cash on
              Delivery, so you pay only once it&apos;s in your hands. Exact
              delivery times vary by location.
            </Body>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/delivery">
                Delivery &amp; COD Details
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-6 sm:p-8">
            <Truck className="mr-2 size-5 text-brand" strokeWidth={1.5} />
            {CITIES.map((city) => (
              <span
                key={city}
                className="rounded-full border border-border bg-surface-1 px-3 py-1 text-xs font-medium text-foreground-secondary"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
