/**
 * Lightweight "content" domain: singleton records (not lists) for the parts
 * of the site that are copy/config rather than catalog data. Kept minimal by
 * design — see ARCHITECTURE.md ("Content architecture"): this is a seam for
 * admin-managed copy, not a full CMS (no rich text, versioning or media
 * library).
 */

export type AboutContent = {
  intro: string;
  updatedAt: string;
};

export type HomepageContent = {
  heroHeading: string;
  heroSubheading: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  /** Path/URL for the hero banner photo; empty string falls back to the
   * illustrated `HeroGraphic`. */
  heroImage: string;
  updatedAt: string;
};

export type ContactConfig = {
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  };
  updatedAt: string;
};
