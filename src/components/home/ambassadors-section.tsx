import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { AmbassadorCarousel } from "@/components/home/ambassador-carousel";
import type { Ambassador } from "@/types";

export function AmbassadorsSection({ ambassadors }: { ambassadors: Ambassador[] }) {
  return (
    <Section className="bg-white">
      <Reveal>
        <SectionHeader
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

      <Reveal>
        <AmbassadorCarousel ambassadors={ambassadors} />
      </Reveal>
    </Section>
  );
}
