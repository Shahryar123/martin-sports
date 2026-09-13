"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guard";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/category";
import { actionError, type ActionResult } from "@/lib/actions/types";
import type { Category } from "@/types";

function revalidateCategoryPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function createCategoryAction(
  values: CategoryFormValues,
): Promise<ActionResult<Category>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const category = await categoryRepository.create({
      ...parsed.data,
      description: parsed.data.description ?? "",
      image: parsed.data.image ?? "",
    });
    revalidateCategoryPaths();
    return { success: true, data: category };
  } catch (error) {
    return actionError(error, "Could not create the category.");
  }
}

export async function updateCategoryAction(
  id: string,
  values: CategoryFormValues,
): Promise<ActionResult<Category>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const category = await categoryRepository.update(id, {
      ...parsed.data,
      description: parsed.data.description ?? "",
      image: parsed.data.image ?? "",
    });
    revalidateCategoryPaths();
    return { success: true, data: category };
  } catch (error) {
    return actionError(error, "Could not update the category.");
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    await categoryRepository.delete(id);
    revalidateCategoryPaths();
    return { success: true, data: undefined };
  } catch (error) {
    return actionError(error, "Could not delete the category.");
  }
}

export async function setCategoryPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult<Category>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    const category = await categoryRepository.setPublished(id, published);
    revalidateCategoryPaths();
    return { success: true, data: category };
  } catch (error) {
    return actionError(error, "Could not update the category.");
  }
}
