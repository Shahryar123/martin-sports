export type NavLink = {
  label: string;
  href: string;
};

export const PRIMARY_NAV: NavLink[] = [
  { label: "Shop", href: "/products" },
  { label: "Ambassadors", href: "/ambassadors" },
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
      { label: "Abdul Qayyum", href: "/about/abdul-qayyum" },
      { label: "Brand Ambassadors", href: "/ambassadors" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Order via WhatsApp", href: "/contact" },
      { label: "Delivery & Cash on Delivery", href: "/delivery" },
    ],
  },
];
