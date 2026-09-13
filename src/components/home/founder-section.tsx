import Link from "next/link";
import { ArrowRight, UserRound, Trophy, GraduationCap, MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Metadata, SectionHeading, Body } from "@/components/ui/typography";
import type { OwnerProfile } from "@/types";

const FACTS = [
  { icon: Trophy, text: "Owner of Martin Sports" },
  { icon: GraduationCap, text: "Athlete & cricket trainer" },
  { icon: MapPin, text: "PIA Sports Complex, Karachi" },
];

export function FounderSection({ owner }: { owner: OwnerProfile }) {
  return (
    <Section surface="muted">
      <Reveal>
        <div className="grid grid-cols-1 gap-10 rounded-xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-12">
          <div className="mx-auto flex aspect-[3/4] w-full max-w-xs items-center justify-center rounded-lg border border-border bg-gradient-to-b from-surface-2 to-surface-1 lg:mx-0">
            <UserRound className="size-24 text-muted-foreground/50" strokeWidth={1} />
          </div>

          <div className="flex flex-col justify-center">
            <Metadata className="text-brand">Founder &amp; Trainer</Metadata>
            <SectionHeading as="h2" className="mt-2">
              {owner.name}
            </SectionHeading>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {FACTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <Icon className="size-4 text-brand" strokeWidth={1.75} />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-3">
              {owner.bio.map((paragraph) => (
                <Body key={paragraph}>{paragraph}</Body>
              ))}
            </div>

            <Link
              href="/about#abdul-qayyum"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              Read more about Abdul Qayyum <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
