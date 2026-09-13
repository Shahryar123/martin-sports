export type AmbassadorSocialLink = {
  platform: string; // e.g. "Instagram", "Twitter"
  url: string;
};

export type Ambassador = {
  id: string;
  slug: string;
  name: string;
  role: string; // e.g. "Brand Ambassador", "First-Class Cricketer"
  photo: string; // empty string = use placeholder
  bio: string;
  achievements: string[];
  socialLinks: AmbassadorSocialLink[];
  published: boolean; // unpublished ambassadors never appear in public pages
  isPlaceholder: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};

export type OwnerProfile = {
  name: string;
  role: string;
  affiliation: string;
  photo: string;
  bio: string[];
};
