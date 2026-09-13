import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";

type BuildMetadataParams = {
  title: string;
  description?: string;
  path?: string; // e.g. "/products/some-slug"
  image?: string;
  noIndex?: boolean;
};

/**
 * Consistent metadata builder for route segments. Root layout sets the
 * title template (`%s | Martin Sports`); individual routes call this to fill
 * in the page-specific piece plus Open Graph / Twitter defaults.
 */
export function buildMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "/",
  image = SITE_CONFIG.ogImage,
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const url = new URL(path, SITE_CONFIG.url).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image }],
      locale: SITE_CONFIG.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
