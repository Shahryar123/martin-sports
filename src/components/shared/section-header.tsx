import type { ReactNode } from "react";
import { SectionHeading, Body } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  headingClassName?: string;
};

function highlightLastWord(title: string) {
  const i = title.lastIndexOf(" ");
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i + 1)}
      <span className="text-[#a33b2e]">{title.slice(i + 1)}</span>
    </>
  );
}

/** Title + optional description + optional trailing action, the recurring
 * header block above a section's content (product grids, testimonials,
 * etc.). */
export function SectionHeader({
  title,
  description,
  action,
  align = "left",
  className,
  headingClassName,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end gap-4 sm:mb-10",
        centered ? "justify-center text-center" : "justify-between",
        className,
      )}
    >
      <div>
        <SectionHeading className={headingClassName}>
          {typeof title === "string" ? highlightLastWord(title) : title}
        </SectionHeading>
        {description && (
          <Body className={cn("mt-2 max-w-xl", centered && "mx-auto")}>{description}</Body>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
