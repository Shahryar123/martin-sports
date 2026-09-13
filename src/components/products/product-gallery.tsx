"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductImage } from "@/components/products/product-image";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/lib/constants/categories";

type ProductGalleryProps = {
  images: string[];
  name: string;
  category: CategorySlug;
};

/**
 * Horizontally-scrolling, scroll-snapped gallery — gives native touch swipe
 * on mobile for free (no gesture library needed) while still supporting
 * click-through thumbnails and arrow buttons on desktop. A tap/click opens
 * a full-screen lightbox for zoom.
 */
export function ProductGallery({ images, name, category }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToIndex = useCallback((index: number) => {
    const slide = slideRefs.current[index];
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || images.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const index = slideRefs.current.indexOf(visible.target as HTMLDivElement);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { root: container, threshold: 0.6 },
    );

    slideRefs.current.forEach((slide) => slide && observer.observe(slide));
    return () => observer.disconnect();
  }, [images.length]);

  if (images.length === 0) {
    return (
      <ProductImage
        images={[]}
        name={name}
        category={category}
        className="aspect-square w-full rounded-lg"
        priority
      />
    );
  }

  return (
    <div>
      <div className="group relative">
        <div
          ref={scrollRef}
          className="scrollbar-hidden flex aspect-square w-full snap-x snap-mandatory overflow-x-auto rounded-lg border border-border bg-surface-1"
        >
          {images.map((src, i) => (
            <div
              key={src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="relative w-full shrink-0 snap-center"
            >
              <Image
                src={src}
                alt={`${name} — image ${i + 1} of ${images.length}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open full-screen image"
          className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <ZoomIn className="size-4" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              aria-label="Previous image"
              disabled={activeIndex === 0}
              className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(Math.min(images.length - 1, activeIndex + 1))}
              aria-label="Next image"
              disabled={activeIndex === images.length - 1}
              className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <>
          {/* Dots — mobile */}
          <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-5 bg-brand" : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>

          {/* Thumbnails — desktop */}
          <div className="mt-3 hidden grid-cols-4 gap-3 sm:grid">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border transition-colors",
                  i === activeIndex ? "border-brand" : "border-border hover:border-brand/40",
                )}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:max-w-4xl"
        >
          <DialogTitle className="sr-only">{name} — full-screen image</DialogTitle>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-1">
            <Image
              src={images[activeIndex]}
              alt={`${name} — image ${activeIndex + 1} of ${images.length}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-lg"
          >
            <X className="size-4" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                aria-label="Previous image"
                disabled={activeIndex === 0}
                className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((i) => Math.min(images.length - 1, i + 1))}
                aria-label="Next image"
                disabled={activeIndex === images.length - 1}
                className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
