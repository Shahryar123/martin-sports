import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Parallax banner: `bg-fixed` (background-attachment: fixed) pins the
 * image to the viewport instead of the page, so it scrolls slower than
 * the surrounding content — the section's own top/bottom edges are what
 * reveal/cover it. Pure CSS, no JS. Degrades gracefully to a plain cover
 * background (no parallax, but still looks right) on iOS Safari, where
 * `background-attachment: fixed` isn't supported.
 */
export function DeliverySection() {
  return (
    <section className="relative flex h-[80vh] w-full items-end bg-[#0b0b0b] sm:h-[85vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/banner-main.png')] bg-cover bg-center bg-fixed"
      />
      {/* Fades the photo into near-black behind the copy, bottom-left. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent sm:bg-gradient-to-tr sm:via-[#0b0b0b]/40"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 sm:px-8 sm:pb-20 lg:px-8">
        <p className="font-display text-sm font-bold tracking-[0.3em] text-brand uppercase sm:text-base">
          New Season Kit
        </p>
        <h2 className="font-display mt-4 text-5xl leading-[0.95] font-extrabold italic uppercase sm:text-6xl lg:text-7xl">
          <span className="block text-[#f3efe4]">Gear Up With</span>
          <span className="block text-brand">Martin Sports</span>
        </h2>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="font-display inline-flex h-14 items-center gap-3 rounded-md bg-brand px-8 text-lg font-bold tracking-[0.15em] text-[#0b0b0b] uppercase shadow-[0_8px_30px_-6px] shadow-brand/60 transition-colors hover:bg-brand/90"
          >
            Shop Now <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/shop?category=bats"
            className="font-display inline-flex h-14 items-center rounded-md border border-brand px-8 text-lg font-bold tracking-[0.15em] text-[#f3efe4] uppercase transition-colors hover:bg-brand/10"
          >
            Shop Bats
          </Link>
        </div>
      </div>
    </section>
  );
}
