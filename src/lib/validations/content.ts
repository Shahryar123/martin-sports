import { z } from "zod";

export const aboutFormSchema = z.object({
  intro: z.string().trim().min(1, "Intro text is required"),
});
export type AboutFormValues = z.infer<typeof aboutFormSchema>;

export const ownerProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  affiliation: z.string().trim().min(1, "Affiliation is required"),
  photo: z.string().trim().optional().or(z.literal("")),
  bio: z.array(z.string().trim().min(1)).default([]),
});
export type OwnerProfileFormValues = z.infer<typeof ownerProfileFormSchema>;

export const homepageFormSchema = z.object({
  heroHeading: z.string().trim().min(1, "Heading is required").max(150),
  heroSubheading: z.string().trim().min(1, "Subheading is required").max(400),
  heroCtaLabel: z.string().trim().min(1, "CTA label is required").max(40),
  heroCtaHref: z.string().trim().min(1, "CTA link is required"),
  heroImage: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || v.startsWith("/") || /^https?:\/\//.test(v),
      "Enter a path starting with / or a full https:// URL",
    ),
});
export type HomepageFormValues = z.infer<typeof homepageFormSchema>;

export const contactFormSchema = z.object({
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(1, "Address is required"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Enter digits only, E.164 without + (e.g. 923001234567)"),
  social: z.object({
    instagram: z.string().trim().optional().or(z.literal("")),
    facebook: z.string().trim().optional().or(z.literal("")),
    tiktok: z.string().trim().optional().or(z.literal("")),
    youtube: z.string().trim().optional().or(z.literal("")),
  }),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const testimonialFormSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required"),
  authorLocation: z.string().trim().min(1, "Location is required"),
  rating: z.coerce.number().int().min(1).max(5),
  quote: z.string().trim().min(1, "Quote is required").max(500),
  productSlug: z.string().trim().optional().or(z.literal("")),
  published: z.boolean().default(true),
});
export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;
