import { z } from "zod";

export const ambassadorSocialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Platform is required"),
  url: z.string().trim().url("Enter a valid URL"),
});

export const ambassadorFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  role: z.string().trim().min(1, "Role is required").max(150),
  photo: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || v.startsWith("/") || /^https?:\/\//.test(v),
      "Enter a path starting with / or a full https:// URL",
    ),
  bio: z.string().trim().min(1, "Biography is required"),
  achievements: z.array(z.string().trim().min(1)).default([]),
  socialLinks: z.array(ambassadorSocialLinkSchema).default([]),
  published: z.boolean().default(true),
});

export type AmbassadorFormValues = z.infer<typeof ambassadorFormSchema>;
