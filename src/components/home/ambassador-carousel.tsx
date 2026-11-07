"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { ProductHeading, Metadata } from "@/components/ui/typography";
import type { Ambassador } from "@/types";

/** Scroll-snap carousel showing three cards at a time on sm+ (one and a
 * peek on phones); arrows scroll by one card. */
export function AmbassadorCarousel({ ambassadors }: { ambassadors: Ambassador[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | null>(null);

  // Arrow clicks animate scrollLeft by hand with an ease-in-out curve:
  // native `behavior: "smooth"` combined with mandatory snapping makes the
  // browser fight itself and the slide stutters. Snapping is switched off
  // for the duration of the animation and restored once it lands on a card.
  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.offsetWidth + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const start = track.scrollLeft;
    const current = Math.round(start / step);
    const target = Math.max(0, Math.min(maxScroll, (current + direction) * step));
    if (target === start) return;

    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : 650;
    const startTime = performance.now();
    track.style.scrollSnapType = "none";

    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - startTime) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      track.scrollLeft = start + (target - start) * eased;
      if (t < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
        track.style.scrollSnapType = "";
      }
    };
    animationRef.current = requestAnimationFrame(tick);
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="scrollbar-hidden flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain sm:gap-6"
      >
        {ambassadors.map((ambassador, i) => (
          <div
            key={ambassador.id}
            className="group relative w-[80%] shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-card sm:w-[calc((100%-3rem)/3)]"
          >
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-b from-surface-2 to-surface-1">
              {ambassador.photo ? (
                <Image
                  src={ambassador.photo}
                  alt={ambassador.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 80vw"
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
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous ambassadors"
          className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next ambassadors"
          className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
