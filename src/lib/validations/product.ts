import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

export const productImageSchema = z
  .string()
  .trim()
  .min(1, "Image path/URL is required")
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//.test(v),
    "Enter a path starting with / or a full https:// URL",
  );

export const productSpecSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  value: z.string().trim().min(1, "Value is required"),
});

export const productSizeSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Label is required"),
  priceDelta: z.coerce.number().optional(),
  inStock: z.boolean().default(true),
  sku: z.string().trim().optional(),
});

export const productFormSchema = z
  .object({
    // Basic
    name: z.string().trim().min(2, "Name is required").max(200),
    sku: z.string().trim().min(1, "SKU is required").max(64),
    brand: z.string().trim().min(1, "Brand is required").max(120),
    category: z.string().trim().min(1, "Category is required"),

    // Pricing
    price: z.coerce.number().positive("Price must be greater than 0"),
    salePrice: z.coerce.number().positive().optional(),
    currency: z.literal("PKR").default("PKR"),

    // Inventory
    quantity: z.coerce.number().int().nonnegative().optional(),
    stockStatus: z.enum(["in-stock", "low-stock", "out-of-stock"]),

    // Content
    shortDescription: z.string().trim().min(1, "Short description is required").max(300),
    description: z.string().trim().min(1, "Description is required"),
    features: z.array(z.string().trim().min(1)).default([]),
    specifications: z.array(productSpecSchema).default([]),
    sizes: z.array(productSizeSchema).default([]),

    // Images
    images: z.array(productImageSchema).min(1, "Add at least a main image"),

    // Visibility
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    isNew: z.boolean().default(false),
    bestSeller: z.boolean().default(false),

    // SEO
    slug: slugSchema,
    seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
    seoDescription: z.string().trim().max(160).optional().or(z.literal("")),
  })
  .refine((data) => data.salePrice === undefined || data.salePrice < data.price, {
    message: "Sale price must be less than the regular price",
    path: ["salePrice"],
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;
