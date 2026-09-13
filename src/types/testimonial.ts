export type Testimonial = {
  id: string;
  authorName: string;
  authorLocation: string; // city, Pakistan
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  productSlug?: string;
  isPlaceholder: boolean;
};
