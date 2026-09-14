import type { LucideIcon } from "lucide-react";
import {
  Shield,
  CircleDot,
  Hand,
  HardHat,
  ShieldHalf,
  Footprints,
  Briefcase,
  Grip,
  Wrench,
  Dumbbell,
} from "lucide-react";

export const CATEGORIES = [
  { slug: "bats", name: "Cricket Bats", icon: Shield },
  { slug: "balls", name: "Cricket Balls", icon: CircleDot },
  { slug: "batting-gloves", name: "Batting Gloves", icon: Hand },
  { slug: "keeping-gloves", name: "Wicket-Keeping Gloves", icon: Hand },
  { slug: "helmets", name: "Cricket Helmets", icon: HardHat },
  { slug: "pads", name: "Pads", icon: ShieldHalf },
  { slug: "thigh-guards", name: "Thigh Guards", icon: ShieldHalf },
  { slug: "arm-guards", name: "Arm Guards", icon: ShieldHalf },
  { slug: "chest-guards", name: "Chest Guards", icon: ShieldHalf },
  { slug: "elbow-guards", name: "Elbow Guards", icon: ShieldHalf },
  { slug: "shoes", name: "Cricket Shoes", icon: Footprints },
  { slug: "kit-bags", name: "Kit Bags", icon: Briefcase },
  { slug: "bat-grips", name: "Bat Grips", icon: Grip },
  { slug: "accessories", name: "Cricket Accessories", icon: Wrench },
  { slug: "training-equipment", name: "Training Equipment", icon: Dumbbell },
] as const satisfies ReadonlyArray<{
  slug: string;
  name: string;
  icon: LucideIcon;
}>;

// A plain string, not a literal union: category management (`/admin/categories`)
// lets admins create categories beyond this seed list, so the type can't be a
// closed union derived from `CATEGORIES` anymore. `CATEGORIES` remains the
// seed data + icon/name lookup for the original 15 taxonomy entries.
export type CategorySlug = string;

export function getCategoryName(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function getCategoryIcon(slug: CategorySlug): LucideIcon {
  return CATEGORIES.find((c) => c.slug === slug)?.icon ?? Wrench;
}

/**
 * Curated top-level groups shown on the homepage — coarser than the full
 *15-slug catalog taxonomy (e.g. "Gloves" spans both batting and
 * wicket-keeping gloves, "Protection" spans the four guard categories).
 * `slugs` feeds the products page's `categories` (plural) filter; `label`
 * overrides the page heading since a group has no single category name.
 */
export const HOMEPAGE_CATEGORY_GROUPS: ReadonlyArray<{
  label: string;
  icon: LucideIcon;
  slugs: CategorySlug[];
}> = [
  { label: "Cricket Bats", icon: Shield, slugs: ["bats"] },
  { label: "Cricket Balls", icon: CircleDot, slugs: ["balls"] },
  { label: "Gloves", icon: Hand, slugs: ["batting-gloves", "keeping-gloves"] },
  { label: "Helmets", icon: HardHat, slugs: ["helmets"] },
  { label: "Pads", icon: ShieldHalf, slugs: ["pads"] },
  {
    label: "Protection",
    icon: ShieldHalf,
    slugs: ["thigh-guards", "arm-guards", "chest-guards", "elbow-guards"],
  },
  { label: "Shoes", icon: Footprints, slugs: ["shoes"] },
  { label: "Kit Bags", icon: Briefcase, slugs: ["kit-bags"] },
  { label: "Accessories", icon: Wrench, slugs: ["accessories", "bat-grips"] },
];

export function homepageCategoryHref(group: (typeof HOMEPAGE_CATEGORY_GROUPS)[number]): string {
  if (group.slugs.length === 1) {
    return `/shop?category=${group.slugs[0]}`;
  }
  return `/shop?categories=${group.slugs.join(",")}&label=${encodeURIComponent(group.label)}`;
}
