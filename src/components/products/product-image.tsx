import Image from "next/image";
import { getCategoryIcon } from "@/lib/constants/categories";
import type { CategorySlug } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  images: string[];
  name: string;
  category: CategorySlug;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders the first real product image when one exists, otherwise falls
 * back to a branded placeholder tile (category icon on a dark surface).
 * This is the seam where real photography drops in later: populate
 * `Product.images` and this component switches automatically — no other
 * code needs to change. See ARCHITECTURE.md ("Image & data replacement").
 */
export function ProductImage({
  images,
  name,
  category,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: ProductImageProps) {
  const src = images[0];

  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-1", className)}>
        <Image
          src={src}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const Icon = getCategoryIcon(category);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-border bg-surface-1",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2/60 to-transparent" />
      {/* getCategoryIcon returns a stable, module-scoped icon component from
          CATEGORIES — it never creates a new component during render. */}
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon className="relative size-10 text-muted-foreground/60" strokeWidth={1.25} />
    </div>
  );
}
