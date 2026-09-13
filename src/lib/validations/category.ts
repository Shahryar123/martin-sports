import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  image: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || v.startsWith("/") || /^https?:\/\//.test(v),
      "Enter a path starting with / or a full https:// URL",
    ),
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
