import type { Ambassador, OwnerProfile } from "@/types";

/**
 * PLACEHOLDER ambassador entries. Names, roles and bios are generic
 * stand-ins — no real athlete identities, statistics or affiliations are
 * implied. Replace with real, approved ambassador profiles before launch.
 */
export const AMBASSADORS: Ambassador[] = [
  {
    id: "amb-01",
    slug: "ambassador-one",
    name: "Ambassador One",
    role: "Brand Ambassador",
    photo: "",
    bio: "Profile details to be provided by Martin Sports.",
    isPlaceholder: true,
  },
  {
    id: "amb-02",
    slug: "ambassador-two",
    name: "Ambassador Two",
    role: "Brand Ambassador",
    photo: "",
    bio: "Profile details to be provided by Martin Sports.",
    isPlaceholder: true,
  },
  {
    id: "amb-03",
    slug: "ambassador-three",
    name: "Ambassador Three",
    role: "Brand Ambassador",
    photo: "",
    bio: "Profile details to be provided by Martin Sports.",
    isPlaceholder: true,
  },
];

/**
 * Owner profile — facts below are limited to what was explicitly provided:
 * Abdul Qayyum is the owner of Martin Sports, an athlete and cricket trainer
 * at PIA Sports Complex, Karachi, who has trained numerous cricketers,
 * including players who have gone on to represent Pakistan at national
 * level. No names, dates, statistics or awards are invented here — those
 * must be supplied and approved before publishing.
 */
export const OWNER_PROFILE: OwnerProfile = {
  name: "Abdul Qayyum",
  role: "Owner & Founder, Martin Sports",
  affiliation: "Athlete & Cricket Trainer, PIA Sports Complex, Karachi",
  photo: "",
  bio: [
    "Abdul Qayyum is the owner of Martin Sports, an athlete and cricket trainer based at the PIA Sports Complex in Karachi.",
    "Over the course of his coaching career he has trained numerous cricketers, including players who have gone on to represent Pakistan at the national level.",
  ],
};
