"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guard";
import { productRepository } from "@/lib/repositories/product-repository";
import { productFormSchema, type ProductFormValues } from "@/lib/validations/product";
import { actionError, type ActionResult } from "@/lib/actions/types";
import type { Product } from "@/types";

const productFlagSchema = z.enum(["published", "featured", "isNew", "bestSeller"]);

function toWriteInput(values: ProductFormValues) {
  const [mainImage, ...rest] = values.images;
  const seoTitle = values.seoTitle?.trim();
  const seoDescription = values.seoDescription?.trim();

  return {
    name: values.name,
    slug: values.slug,
    sku: values.sku,
    brand: values.brand,
    category: values.category,
    shortDescription: values.shortDescription,
    description: values.description,
    features: values.features,
    specifications: values.specifications,
    price: values.price,
    salePrice: values.salePrice,
    currency: values.currency,
    images: [mainImage, ...rest],
    sizes: values.sizes.map((size, index) => ({
      id: size.id ?? `size-${index}-${Math.random().toString(36).slice(2, 8)}`,
      label: size.label,
      priceDelta: size.priceDelta,
      inStock: size.inStock,
      sku: size.sku,
    })),
    stockStatus: values.stockStatus,
    quantity: values.quantity,
    featured: values.featured,
    isNew: values.isNew,
    bestSeller: values.bestSeller,
    published: values.published,
    seo: seoTitle || seoDescription ? { title: seoTitle, description: seoDescription } : undefined,
  };
}

function revalidateProductPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function createProductAction(
  values: ProductFormValues,
): Promise<ActionResult<Product>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const product = await productRepository.create(toWriteInput(parsed.data));
    revalidateProductPaths();
    return { success: true, data: product };
  } catch (error) {
    return actionError(error, "Could not create the product.");
  }
}

export async function updateProductAction(
  id: string,
  values: ProductFormValues,
): Promise<ActionResult<Product>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const product = await productRepository.update(id, toWriteInput(parsed.data));
    revalidateProductPaths();
    revalidatePath(`/shop/${product.slug}`);
    return { success: true, data: product };
  } catch (error) {
    return actionError(error, "Could not update the product.");
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    await productRepository.delete(id);
    revalidateProductPaths();
    return { success: true, data: undefined };
  } catch (error) {
    return actionError(error, "Could not delete the product.");
  }
}

type ProductFlag = "published" | "featured" | "isNew" | "bestSeller";

export async function toggleProductFlagAction(
  id: string,
  flag: ProductFlag,
  value: boolean,
): Promise<ActionResult<Product>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsedFlag = productFlagSchema.safeParse(flag);
  if (!parsedFlag.success) {
    return { success: false, error: "Invalid field." };
  }

  try {
    const product = await productRepository.update(id, { [parsedFlag.data]: value });
    revalidateProductPaths();
    return { success: true, data: product };
  } catch (error) {
    return actionError(error, "Could not update the product.");
  }
}
