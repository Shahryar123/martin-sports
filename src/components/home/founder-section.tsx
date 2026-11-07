import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, UserRound, MapPin, Trophy } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Body } from "@/components/ui/typography";
import type { OwnerProfile } from "@/types";

const FACTS = [
  { icon: Briefcase, text: "Owner of Martin Sports" },
  { icon: UserRound, text: "Athlete & cricket trainer" },
  { icon: MapPin, text: "PIA Sports Complex, Karachi" },
];

const HIGHLIGHT = "represent Pakistan at the national level";

/** Bolds and underlines the key achievement phrase inside a bio paragraph. */
function withHighlight(paragraph: string) {
  const index = paragraph.indexOf(HIGHLIGHT);
  if (index === -1) return paragraph;
  return (
    <>
      {paragraph.slice(0, index)}
      <strong className="font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4">
        {HIGHLIGHT}
      </strong>
      {paragraph.slice(index + HIGHLIGHT.length)}
    </>
  );
}

export function FounderSection({ owner }: { owner: OwnerProfile }) {
  const [firstName, ...rest] = owner.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <Section className="theme-forest relative overflow-hidden bg-background text-foreground">
      <Reveal>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
          {/* Photo with offset gold frame and founder badge */}
          <div className="relative mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 top-4 right-4 rounded-lg border border-brand/60"
            />
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
              <Image
                src="/coach.jpg"
                alt={owner.name}
                fill
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-6 bottom-8 flex size-24 flex-col items-center justify-center rounded-full border-4 border-background bg-brand text-center text-brand-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] sm:size-28">
              <span className="text-[0.55rem] font-semibold tracking-[0.2em] uppercase opacity-80">
                Founder
              </span>
              <span className="font-display text-sm leading-tight font-extrabold italic uppercase sm:text-base">
                Martin
                <br />
                Sports
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="relative flex flex-col">
            <span
              aria-hidden="true"
              className="font-display pointer-events-none absolute top-8 right-0 -z-0 select-none text-[5.5rem] leading-none font-extrabold uppercase text-transparent [-webkit-text-stroke:2px_rgba(243,239,228,0.22)] sm:-top-16 sm:text-[13rem] lg:-top-24 lg:text-[17rem]"
            >
              Coach
            </span>
            <p className="relative flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              <Trophy className="size-4" strokeWidth={1.75} />
              Founder &amp; Trainer
            </p>
            <h2 className="font-display relative mt-3 text-6xl leading-[0.9] font-extrabold italic uppercase sm:text-7xl">
              <span className="block text-foreground">{firstName}</span>
              {lastName && <span className="block text-brand">{lastName}</span>}
            </h2>

            <ul className="relative mt-6 flex flex-wrap gap-2">
              {FACTS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold tracking-wider text-foreground uppercase"
                >
                  <Icon className="size-3.5 text-brand" strokeWidth={1.75} />
                  {text}
                </li>
              ))}
            </ul>

            <div className="relative mt-6 max-w-xl space-y-4">
              {owner.bio.map((paragraph) => (
                <Body key={paragraph} className="text-foreground-secondary">
                  {withHighlight(paragraph)}
                </Body>
              ))}
            </div>

            <Link
              href="/about#abdul-qayyum"
              className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-sm font-bold tracking-[0.15em] text-brand-foreground uppercase shadow-[0_8px_30px_-8px] shadow-brand/50 transition-colors hover:bg-brand/90"
            >
              Read more about {owner.name}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
