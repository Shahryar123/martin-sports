import { SITE_CONFIG } from "@/lib/constants/site";
import { toJsonLd } from "@/lib/structured-data";

/**
 * Site-wide Organization + WebSite JSON-LD, rendered once by the public
 * `(site)` shell (not the admin dashboard, which is `noindex`d anyway —
 * see robots.ts). `sameAs` links to whichever social profiles are
 * actually configured; `WebSite.potentialAction` declares the shop search
 * so Google can offer a sitelinks search box. Product/BreadcrumbList
 * schema stay page-specific (only where that content exists).
 */
export function SiteStructuredData() {
  const sameAs = Object.values(SITE_CONFIG.social).filter(Boolean);

  const entries = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      ...(sameAs.length > 0 && { sameAs }),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_CONFIG.url}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      {entries.map((entry) => (
        <script
          key={entry["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(entry) }}
        />
      ))}
    </>
  );
}
