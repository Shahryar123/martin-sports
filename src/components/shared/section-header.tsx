import type { ReactNode } from "react";
import { SectionHeading, Body, Metadata } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Title + optional eyebrow/description + optional trailing action, the
 * recurring header block above a section's content (product grids,
 * testimonials, etc.). */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10", className)}>
      <div>
        {eyebrow && <Metadata className="mb-2 block text-brand">{eyebrow}</Metadata>}
        <SectionHeading>{title}</SectionHeading>
        {description && <Body className="mt-2 max-w-xl">{description}</Body>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
