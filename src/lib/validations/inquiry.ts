import { z } from "zod";

// Accepts common Pakistani mobile formats: 03XXXXXXXXX or +923XXXXXXXXX
const pakistaniPhoneRegex = /^(\+92|0)3\d{9}$/;

export const customerDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(pakistaniPhoneRegex, "Enter a valid Pakistani mobile number"),
  address: z.string().trim().min(5, "Enter your delivery address"),
  city: z.string().trim().min(2, "Enter your city"),
  notes: z.string().trim().max(500).optional(),
});

export const orderInquirySchema = z.object({
  customer: customerDetailsSchema,
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Add at least one product"),
});

export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
export type OrderInquiryInput = z.infer<typeof orderInquirySchema>;
