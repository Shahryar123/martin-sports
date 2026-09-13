export type NavLink = {
  label: string;
  href: string;
};

/**
 * Primary nav links, used as-is by mobile nav. Desktop nav renders these
 * plus a "Categories" dropdown (see CategoryNavMenu) inserted after "Shop"
 * — that item isn't a plain link, so it's handled separately in
 * SiteHeader rather than living in this array.
 */
export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Brand Ambassadors", href: "/ambassadors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Cricket Bats", href: "/products?category=bats" },
      { label: "Protective Gear", href: "/products?category=pads" },
      { label: "Kit Bags", href: "/products?category=kit-bags" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Martin Sports", href: "/about" },
      { label: "Abdul Qayyum", href: "/about#abdul-qayyum" },
      { label: "Brand Ambassadors", href: "/ambassadors" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Order via WhatsApp", href: "/contact" },
      { label: "Delivery & Cash on Delivery", href: "/delivery" },
    ],
  },
];

export const LEGAL_NAV: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];
