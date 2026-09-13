/**
 * Central site configuration. Values marked PLACEHOLDER must be replaced
 * with real Martin Sports details before launch.
 */
export const SITE_CONFIG = {
  name: "Martin Sports",
  legalName: "Martin Sports",
  tagline: "Cricket Gear Built for the Game",
  description:
    "Martin Sports is a Pakistan-based cricket equipment brand offering bats, balls, protective gear, footwear and accessories, with nationwide Cash on Delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinsports.pk",
  ogImage: "/og-image.jpg",
  locale: "en_PK",
  currency: "PKR" as const,

  // PLACEHOLDER — replace with the real WhatsApp business number (E.164, no leading +/00)
  whatsappNumber: "923000000000",

  contact: {
    // PLACEHOLDER contact details
    phone: "+92 300 0000000",
    email: "info@martinsports.pk",
    address: "PIA Sports Complex, Karachi, Pakistan",
  },

  social: {
    // PLACEHOLDER — social links to be supplied
    instagram: "https://instagram.com/martinsports.pk",
    facebook: "https://facebook.com/martinsports.pk",
    tiktok: "https://tiktok.com/@martinsports.pk",
    youtube: "",
  },

  delivery: {
    nationwide: true,
    codAvailable: true,
    onlinePaymentAvailable: false,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
