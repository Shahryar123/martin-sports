import type { Metadata } from "next";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Brand Ambassadors",
  path: "/ambassadors",
});

export default async function AmbassadorsPage() {
  const ambassadors = await ambassadorRepository.list();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Brand Ambassadors
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder profiles — real ambassador details coming soon.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ambassadors.map((ambassador) => (
          <div
            key={ambassador.id}
            className="rounded-lg border border-border bg-card p-6"
          >
            <p className="font-heading text-lg font-semibold text-foreground">
              {ambassador.name}
            </p>
            <p className="text-sm text-primary">{ambassador.role}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {ambassador.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
