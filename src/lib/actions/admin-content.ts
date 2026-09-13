"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guard";
import { contentRepository } from "@/lib/repositories/content-repository";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { testimonialRepository } from "@/lib/repositories/testimonial-repository";
import {
  aboutFormSchema,
  contactFormSchema,
  homepageFormSchema,
  ownerProfileFormSchema,
  testimonialFormSchema,
  type AboutFormValues,
  type ContactFormValues,
  type HomepageFormValues,
  type OwnerProfileFormValues,
  type TestimonialFormValues,
} from "@/lib/validations/content";
import { actionError, type ActionResult } from "@/lib/actions/types";
import type { AboutContent, ContactConfig, HomepageContent, OwnerProfile, Testimonial } from "@/types";

async function ensureAdmin(): Promise<ActionResult<never> | null> {
  try {
    await requireAdminSession();
    return null;
  } catch {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }
}

export async function updateAboutAction(values: AboutFormValues): Promise<ActionResult<AboutContent>> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const parsed = aboutFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const about = await contentRepository.updateAbout(parsed.data);
    revalidatePath("/admin/content");
    revalidatePath("/about");
    return { success: true, data: about };
  } catch (error) {
    return actionError(error, "Could not update the About content.");
  }
}

export async function updateOwnerProfileAction(
  values: OwnerProfileFormValues,
): Promise<ActionResult<OwnerProfile>> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const parsed = ownerProfileFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const owner = await ambassadorRepository.updateOwnerProfile({
      ...parsed.data,
      photo: parsed.data.photo ?? "",
    });
    revalidatePath("/admin/content");
    revalidatePath("/about");
    revalidatePath("/");
    return { success: true, data: owner };
  } catch (error) {
    return actionError(error, "Could not update the founder profile.");
  }
}

export async function updateHomepageAction(
  values: HomepageFormValues,
): Promise<ActionResult<HomepageContent>> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const parsed = homepageFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const homepage = await contentRepository.updateHomepage(parsed.data);
    revalidatePath("/admin/content");
    return { success: true, data: homepage };
  } catch (error) {
    return actionError(error, "Could not update the homepage content.");
  }
}

export async function updateContactAction(
  values: ContactFormValues,
): Promise<ActionResult<ContactConfig>> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const contact = await contentRepository.updateContact({
      ...parsed.data,
      social: {
        instagram: parsed.data.social.instagram ?? "",
        facebook: parsed.data.social.facebook ?? "",
        tiktok: parsed.data.social.tiktok ?? "",
        youtube: parsed.data.social.youtube ?? "",
      },
    });
    revalidatePath("/admin/content");
    return { success: true, data: contact };
  } catch (error) {
    return actionError(error, "Could not update the contact configuration.");
  }
}

export async function createTestimonialAction(
  values: TestimonialFormValues,
): Promise<ActionResult<Testimonial>> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const parsed = testimonialFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const testimonial = await testimonialRepository.create({
      ...parsed.data,
      productSlug: parsed.data.productSlug || undefined,
      rating: parsed.data.rating as 1 | 2 | 3 | 4 | 5,
    });
    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true, data: testimonial };
  } catch (error) {
    return actionError(error, "Could not create the testimonial.");
  }
}

export async function updateTestimonialAction(
  id: string,
  values: TestimonialFormValues,
): Promise<ActionResult<Testimonial>> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const parsed = testimonialFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const testimonial = await testimonialRepository.update(id, {
      ...parsed.data,
      productSlug: parsed.data.productSlug || undefined,
      rating: parsed.data.rating as 1 | 2 | 3 | 4 | 5,
    });
    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true, data: testimonial };
  } catch (error) {
    return actionError(error, "Could not update the testimonial.");
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  const authError = await ensureAdmin();
  if (authError) return authError;

  try {
    await testimonialRepository.delete(id);
    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return actionError(error, "Could not delete the testimonial.");
  }
}
