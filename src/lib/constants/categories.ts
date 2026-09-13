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

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategoryName(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function getCategoryIcon(slug: CategorySlug): LucideIcon {
  return CATEGORIES.find((c) => c.slug === slug)?.icon ?? Wrench;
}
