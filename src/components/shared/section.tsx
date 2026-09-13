import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Background surface tier. "base" = page background, "muted" = a subtly
   * distinct surface used to separate adjacent sections without a hard
   * border. */
  surface?: "base" | "muted";
  /** Set false to render children directly without the default Container. */
  container?: boolean;
};

export function Section({
  surface = "base",
  container = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 sm:py-20",
        surface === "muted" && "bg-surface-1/40",
        className,
      )}
      {...props}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  );
}
