import { TESTIMONIALS } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types";

export type TestimonialCreateInput = {
  authorName: string;
  authorLocation: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  productSlug?: string;
  published: boolean;
};

export type TestimonialUpdateInput = Partial<TestimonialCreateInput>;

export interface TestimonialRepository {
  list(): Promise<Testimonial[]>;

  adminList(): Promise<Testimonial[]>;
  adminGetById(id: string): Promise<Testimonial | null>;
  create(input: TestimonialCreateInput): Promise<Testimonial>;
  update(id: string, input: TestimonialUpdateInput): Promise<Testimonial>;
  delete(id: string): Promise<void>;
  setPublished(id: string, published: boolean): Promise<Testimonial>;
}

class InMemoryTestimonialRepository implements TestimonialRepository {
  private testimonials: Testimonial[];

  constructor(seed: Testimonial[]) {
    this.testimonials = [...seed];
  }

  async list(): Promise<Testimonial[]> {
    return this.testimonials.filter((t) => t.published);
  }

  async adminList(): Promise<Testimonial[]> {
    return [...this.testimonials];
  }

  async adminGetById(id: string): Promise<Testimonial | null> {
    return this.testimonials.find((t) => t.id === id) ?? null;
  }

  async create(input: TestimonialCreateInput): Promise<Testimonial> {
    const testimonial: Testimonial = {
      id: `t-${Math.random().toString(36).slice(2, 10)}`,
      ...input,
      isPlaceholder: false,
    };
    this.testimonials.push(testimonial);
    return testimonial;
  }

  async update(id: string, input: TestimonialUpdateInput): Promise<Testimonial> {
    const index = this.testimonials.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Testimonial not found");

    const updated: Testimonial = { ...this.testimonials[index], ...input };
    this.testimonials[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.testimonials = this.testimonials.filter((t) => t.id !== id);
  }

  async setPublished(id: string, published: boolean): Promise<Testimonial> {
    return this.update(id, { published });
  }
}

export const testimonialRepository: TestimonialRepository = new InMemoryTestimonialRepository(
  TESTIMONIALS,
);
