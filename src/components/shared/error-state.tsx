"use client";

import { TriangleAlert } from "lucide-react";
import { Body, SectionHeading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

/** Failure placeholder — a data fetch or render threw. Used by
 * app/error.tsx and available for any component-level try/catch UI. */
export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, contact us on WhatsApp.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-border px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <TriangleAlert className="size-6 text-destructive" strokeWidth={1.5} />
      </div>
      <SectionHeading as="h3" className="mt-4 text-lg sm:text-xl">
        {title}
      </SectionHeading>
      <Body className="mt-2 max-w-sm">{description}</Body>
      {onRetry && (
        <Button className="mt-6" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
