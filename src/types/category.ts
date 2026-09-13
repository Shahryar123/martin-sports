export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string; // empty = no image yet
  sortOrder: number;
  published: boolean;
  isPlaceholder: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};
