import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * Typography primitives — the only place font-size/weight/tracking pairs for
 * each level of the hierarchy are defined. Use these instead of ad-hoc
 * text-2xl/font-semibold combinations so the hierarchy stays consistent as
 * the site grows.
 *
 * `as` intentionally accepts any element (not just the default tag) so e.g.
 * a ProductHeading can render as an "h1" when it's the only heading on a
 * page — the *style* is fixed by the component, the semantic tag isn't.
 */
type HeadingProps<Default extends ElementType> = Omit<
  ComponentPropsWithoutRef<Default>,
  "as"
> & {
  as?: ElementType;
};

export function HeroHeading({
  as,
  className,
  ...props
}: HeadingProps<"h1">) {
  const Comp = as ?? "h1";
  return (
    <Comp
      className={cn(
        "font-heading text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeading({
  as,
  className,
  ...props
}: HeadingProps<"h1">) {
  const Comp = as ?? "h1";
  return (
    <Comp
      className={cn(
        "font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  as,
  className,
  ...props
}: HeadingProps<"h2">) {
  const Comp = as ?? "h2";
  return (
    <Comp
      className={cn(
        "font-heading text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
        className,
      )}
      {...props}
    />
  );
}

export function ProductHeading({
  as,
  className,
  ...props
}: HeadingProps<"h3">) {
  const Comp = as ?? "h3";
  return (
    <Comp
      className={cn(
        "font-heading text-lg leading-snug font-semibold tracking-tight sm:text-xl",
        className,
      )}
      {...props}
    />
  );
}

export function Body({
  as,
  className,
  ...props
}: HeadingProps<"p">) {
  const Comp = as ?? "p";
  return (
    <Comp
      className={cn(
        "text-sm leading-relaxed text-foreground-secondary sm:text-base",
        className,
      )}
      {...props}
    />
  );
}

export function Caption({
  as,
  className,
  ...props
}: HeadingProps<"p">) {
  const Comp = as ?? "p";
  return (
    <Comp className={cn("text-xs leading-normal text-muted-foreground", className)} {...props} />
  );
}

export function Metadata({
  as,
  className,
  ...props
}: HeadingProps<"span">) {
  const Comp = as ?? "span";
  return (
    <Comp
      className={cn(
        "text-xs font-medium tracking-wide text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}
