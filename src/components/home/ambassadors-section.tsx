import Link from "next/link";
import Image from "next/image";
import { ArrowRight, UserRound } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { ProductHeading, Metadata } from "@/components/ui/typography";
import type { Ambassador } from "@/types";

export function AmbassadorsSection({ ambassadors }: { ambassadors: Ambassador[] }) {
  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="The Roster"
          title="Brand Ambassadors"
          description="Athletes who represent Martin Sports on and off the field. Full profiles coming soon."
          action={
            <Link
              href="/ambassadors"
              className="hidden items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {ambassadors.map((ambassador, i) => (
          <Reveal key={ambassador.id} delay={i * 0.08}>
            <div className="group relative overflow-hidden rounded-lg border border-border bg-card">
              <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-b from-surface-2 to-surface-1">
                {ambassador.photo ? (
                  <Image
                    src={ambassador.photo}
                    alt={ambassador.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="font-heading absolute -bottom-6 select-none text-[10rem] leading-none font-bold text-foreground/[0.04]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <UserRound
                      className="relative size-20 text-muted-foreground/50 transition-transform duration-300 group-hover:scale-105"
                      strokeWidth={1}
                    />
                  </>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <ProductHeading as="h3" className="text-base text-white sm:text-lg">
                  {ambassador.name}
                </ProductHeading>
                <Metadata className="mt-0.5 text-brand">{ambassador.role}</Metadata>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
