"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guard";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { ambassadorFormSchema, type AmbassadorFormValues } from "@/lib/validations/ambassador";
import { actionError, type ActionResult } from "@/lib/actions/types";
import type { Ambassador } from "@/types";

function revalidateAmbassadorPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/ambassadors");
  revalidatePath("/ambassadors");
  revalidatePath("/");
}

export async function createAmbassadorAction(
  values: AmbassadorFormValues,
): Promise<ActionResult<Ambassador>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsed = ambassadorFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const ambassador = await ambassadorRepository.create({
      ...parsed.data,
      photo: parsed.data.photo ?? "",
    });
    revalidateAmbassadorPaths();
    return { success: true, data: ambassador };
  } catch (error) {
    return actionError(error, "Could not create the ambassador.");
  }
}

export async function updateAmbassadorAction(
  id: string,
  values: AmbassadorFormValues,
): Promise<ActionResult<Ambassador>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const parsed = ambassadorFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const ambassador = await ambassadorRepository.update(id, {
      ...parsed.data,
      photo: parsed.data.photo ?? "",
    });
    revalidateAmbassadorPaths();
    return { success: true, data: ambassador };
  } catch (error) {
    return actionError(error, "Could not update the ambassador.");
  }
}

export async function deleteAmbassadorAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    await ambassadorRepository.delete(id);
    revalidateAmbassadorPaths();
    return { success: true, data: undefined };
  } catch (error) {
    return actionError(error, "Could not delete the ambassador.");
  }
}

export async function setAmbassadorPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult<Ambassador>> {
  try {
    await requireAdminSession();
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    const ambassador = await ambassadorRepository.setPublished(id, published);
    revalidateAmbassadorPaths();
    return { success: true, data: ambassador };
  } catch (error) {
    return actionError(error, "Could not update the ambassador.");
  }
}
