import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { MotionPress } from "@/components/shared/motion-press";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SectionHeading, Body } from "@/components/ui/typography";

export function WhatsAppCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#070b0e] px-6 py-20 text-center sm:py-28">
      {/* The photo is narrower than the section, so on wider screens it's
          shown at full height pinned to the right (whole ball visible) and
          its left edge fades into a background color sampled from the
          photo's own near-black left side. */}
      <div className="absolute inset-0 sm:left-auto sm:aspect-[643/360]">
        <Image
          src="/banner-home.jpg"
          alt=""
          fill
          sizes="(min-width: 640px) 60vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-[#070b0e] to-transparent sm:block" />
      </div>

      {/* The illustration sits on pure black; `mix-blend-lighten` lets that
          black drop out so it merges into the section instead of showing
          as a darker square. */}
      <div className="absolute bottom-0 left-0 hidden aspect-square h-[95%] origin-bottom scale-110 mix-blend-lighten lg:block">
        <Image
          src="/ready-sec.jpg"
          alt=""
          fill
          sizes="420px"
          className="object-contain object-bottom"
        />
      </div>

      {/* The banner photo is dark, so this section borrows the
          header/footer's cream-on-dark token override instead of the
          page's usual dark-green-on-cream text. */}
      <Reveal className="theme-forest relative text-foreground">
        <SectionHeading as="h2">
          Ready to <span className="text-[#c4473a] [text-shadow:0_0_18px_rgba(214,72,58,0.55),0_0_4px_rgba(214,72,58,0.4)]">
            Gear Up?
          </span>
        </SectionHeading>
        <Body className="mx-auto mt-4 max-w-lg">
          Message us on WhatsApp for sizing help, availability, or to place
          your order directly — no account or checkout required.
        </Body>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MotionPress>
            <WhatsAppButton className="font-display h-14 gap-3 rounded-md bg-brand px-8 text-lg font-bold tracking-[0.15em] text-[#0b0b0b] uppercase shadow-[0_8px_30px_-6px] shadow-brand/60 hover:bg-brand/90 [&_svg]:size-5" />
          </MotionPress>
          <Link
            href="/shop"
            className="font-display inline-flex h-14 items-center gap-3 rounded-md border border-brand px-8 text-lg font-bold tracking-[0.15em] text-[#f3efe4] uppercase transition-colors hover:bg-brand/10"
          >
            Browse Products <ArrowRight className="size-5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
