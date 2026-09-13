import { SITE_CONFIG } from "@/lib/constants/site";
import type { AboutContent, ContactConfig, HomepageContent } from "@/types";

const SEED_TIMESTAMP = "2025-01-01T00:00:00.000Z";

/**
 * Seed values for the admin-managed "content" singletons — mirrors the copy
 * currently hardcoded in the (site) pages/components so editing here starts
 * from what's actually live. See ARCHITECTURE.md ("Content architecture") —
 * wiring these back into the public pages (which today read `SITE_CONFIG`
 * directly, a build-time constant) is a follow-up, not done in this phase.
 */
export const ABOUT_CONTENT: AboutContent = {
  intro:
    "Martin Sports is a Pakistan-based cricket equipment brand. Full brand story content is coming soon.",
  updatedAt: SEED_TIMESTAMP,
};

export const HOMEPAGE_CONTENT: HomepageContent = {
  heroHeading: "Built for the Game. Trusted by Cricketers.",
  heroSubheading:
    "Martin Sports is a Pakistan-based cricket equipment brand — bats, balls, protective gear, footwear and accessories chosen with real coaching experience behind them, delivered nationwide with Cash on Delivery.",
  heroCtaLabel: "Shop the Collection",
  heroCtaHref: "/shop",
  updatedAt: SEED_TIMESTAMP,
};

export const CONTACT_CONFIG: ContactConfig = {
  phone: SITE_CONFIG.contact.phone,
  email: SITE_CONFIG.contact.email,
  address: SITE_CONFIG.contact.address,
  whatsappNumber: SITE_CONFIG.whatsappNumber,
  social: { ...SITE_CONFIG.social },
  updatedAt: SEED_TIMESTAMP,
};
