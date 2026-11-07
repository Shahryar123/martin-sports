"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { ProductHeading, Metadata } from "@/components/ui/typography";
import type { Ambassador } from "@/types";

// The list is rendered three times back to back and the view is kept on the
// middle copy: whenever a move lands in the first or last copy, scrollLeft
// silently jumps by one copy's width to the identical card in the middle,
// so the carousel loops endlessly in both directions.
const COPIES = 3;

function measure(track: HTMLDivElement) {
  const card = track.firstElementChild as HTMLElement | null;
  if (!card) return null;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = card.offsetWidth + gap;
  return { step, setWidth: step * (track.children.length / COPIES) };
}

/** Looping scroll-snap carousel showing three cards at a time on sm+ (one
 * and a peek on phones); arrows scroll by one card. */
export function AmbassadorCarousel({ ambassadors }: { ambassadors: Ambassador[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const items = Array.from({ length: COPIES }, (_, copy) =>
    ambassadors.map((ambassador, i) => ({ ambassador, i, copy })),
  ).flat();

  function recenter() {
    const track = trackRef.current;
    const m = track && measure(track);
    if (!track || !m) return;
    let offset = 0;
    if (track.scrollLeft < m.setWidth - m.step / 2) offset = m.setWidth;
    else if (track.scrollLeft >= m.setWidth * 2 - m.step / 2) offset = -m.setWidth;
    if (offset === 0) return;
    track.style.scrollSnapType = "none";
    track.scrollLeft += offset;
    requestAnimationFrame(() => {
      track.style.scrollSnapType = "";
    });
  }

  useEffect(() => {
    const track = trackRef.current;
    const m = track && measure(track);
    if (!track || !m) return;
    track.style.scrollSnapType = "none";
    track.scrollLeft = m.setWidth;
    track.style.scrollSnapType = "";

    // Swipes/trackpad scrolls settle via snapping; re-center once they stop.
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (animationRef.current !== null) return;
      clearTimeout(timer);
      timer = setTimeout(recenter, 150);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Arrow clicks animate scrollLeft by hand with an ease-in-out curve:
  // native `behavior: "smooth"` combined with mandatory snapping makes the
  // browser fight itself and the slide stutters. Snapping is switched off
  // for the duration of the animation and restored once it lands on a card.
  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    const m = track && measure(track);
    if (!track || !m) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    recenter();
    const start = track.scrollLeft;
    const target = (Math.round(start / m.step) + direction) * m.step;

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
        recenter();
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
        {items.map(({ ambassador, i, copy }) => (
          <div
            key={`${ambassador.id}-${copy}`}
            aria-hidden={copy !== 1 || undefined}
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
