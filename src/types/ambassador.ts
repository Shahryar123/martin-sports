export type Ambassador = {
  id: string;
  slug: string;
  name: string;
  role: string; // e.g. "Brand Ambassador", "First-Class Cricketer"
  photo: string; // empty string = use placeholder
  bio: string;
  isPlaceholder: boolean;
};

export type OwnerProfile = {
  name: string;
  role: string;
  affiliation: string;
  photo: string;
  bio: string[];
};
