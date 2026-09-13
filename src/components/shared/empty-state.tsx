import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";
import { Body, SectionHeading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/** "Nothing here yet" placeholder — no results, empty cart, empty admin
 * list, etc. Distinct from ErrorState, which is for failures. */
export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-1">
        <Icon className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <SectionHeading as="h3" className="mt-4 text-lg sm:text-xl">
        {title}
      </SectionHeading>
      {description && <Body className="mt-2 max-w-sm">{description}</Body>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
