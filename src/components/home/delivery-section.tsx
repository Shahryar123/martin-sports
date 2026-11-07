import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The banner artwork already carries its own logo, wordmark and icon row,
 * so the copy sits in a black band beneath it rather than on top — there's
 * no empty area in the image that text could occupy without colliding.
 */
export function DeliverySection() {
  return (
    <section className="bg-[#0b0b0b]">
      <div className="relative aspect-[1296/540] w-full">
        <Image
          src="/banner-main.png"
          alt="Martin Sports Gear — Believe & Achieve"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.3em] text-brand uppercase sm:text-base">
            New Season Kit
          </p>
          <h1 className="font-display mt-3 text-5xl leading-[0.95] font-extrabold italic uppercase sm:text-6xl lg:text-7xl">
            <span className="text-[#f3efe4]">Gear Up With </span>
            <span className="text-brand">Martin Sports</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-4">
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
