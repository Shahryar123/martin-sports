import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Delivery & Cash on Delivery",
  path: "/delivery",
});

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Delivery &amp; Cash on Delivery
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Martin Sports delivers nationwide across Pakistan with Cash on
        Delivery — pay when your order arrives. Detailed delivery timelines
        and coverage information will be published here.
      </p>
    </div>
  );
}
