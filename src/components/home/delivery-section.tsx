import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="relative flex h-[70vh] w-full flex-col items-end justify-end gap-4 px-6 pb-16 sm:h-[85vh] sm:px-16 sm:pb-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/banner-main.png')] bg-cover bg-center bg-fixed"
      />
      <p className="font-heading relative text-2xl font-bold tracking-wide text-white uppercase [text-shadow:0_2px_16px_rgba(0,0,0,0.6)] sm:text-4xl">
        Gear Up With Martin Sports
      </p>
      <Button
        size="lg"
        asChild
        className="relative h-14 bg-[#5e0809] px-10 text-lg font-semibold text-white hover:bg-[#5e0809]/85 sm:h-16 sm:px-14 sm:text-xl"
      >
        <Link href="/shop">Shop Now</Link>
      </Button>
    </div>
  );
}
