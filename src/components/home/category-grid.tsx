import Link from "next/link";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { HOMEPAGE_CATEGORY_GROUPS, homepageCategoryHref } from "@/lib/constants/categories";

export function CategoryGrid() {
  return (
    <Section surface="muted">
      <Reveal>
        <SectionHeader
          eyebrow="Shop by Category"
          title="Everything for Your Kit"
          description="From the bat in your hands to the bag on your shoulder, browse the full range by category."
        />
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {HOMEPAGE_CATEGORY_GROUPS.map((group, i) => {
          const Icon = group.icon;
          const href = homepageCategoryHref(group);
          return (
            <Reveal key={group.label} delay={i * 0.04}>
              <Link
                href={href}
                className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-border bg-card px-4 py-8 text-center transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon
                  className="pointer-events-none absolute -right-3 -bottom-3 size-20 text-foreground/[0.03] transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1}
                />
                <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-1 transition-colors group-hover:border-brand/40">
                  <Icon className="size-5 text-brand" strokeWidth={1.5} />
                </div>
                <span className="relative text-sm font-medium text-foreground">
                  {group.label}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
