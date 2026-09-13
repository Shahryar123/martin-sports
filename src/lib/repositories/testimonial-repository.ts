import { TESTIMONIALS } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types";

export interface TestimonialRepository {
  list(): Promise<Testimonial[]>;
}

class InMemoryTestimonialRepository implements TestimonialRepository {
  async list(): Promise<Testimonial[]> {
    return TESTIMONIALS;
  }
}

export const testimonialRepository: TestimonialRepository =
  new InMemoryTestimonialRepository();
