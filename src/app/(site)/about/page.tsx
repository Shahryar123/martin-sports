import type { Metadata } from "next";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Martin Sports",
  path: "/about",
});

export default async function AboutPage() {
  const owner = await ambassadorRepository.getOwnerProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        About Martin Sports
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Martin Sports is a Pakistan-based cricket equipment brand. Full brand
        story content is coming soon.
      </p>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {owner.name}
        </h2>
        <p className="text-sm text-primary">{owner.role}</p>
        <p className="text-sm text-muted-foreground">{owner.affiliation}</p>
        <div className="mt-4 space-y-3">
          {owner.bio.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
