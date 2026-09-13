export type Testimonial = {
  id: string;
  authorName: string;
  authorLocation: string; // city, Pakistan
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  productSlug?: string;
  published: boolean; // unpublished testimonials never appear in public pages
  isPlaceholder: boolean;
};
