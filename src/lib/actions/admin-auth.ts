"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/auth/admin";
import { createSession, destroySession } from "@/lib/auth/session";
import { adminLoginSchema } from "@/lib/validations/auth";
import { clearAttempts, isRateLimited, recordFailedAttempt } from "@/lib/auth/rate-limit";

export type AdminLoginState = {
  error?: string;
};

export async function loginAdminAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const rateLimitKey = parsed.data.email.trim().toLowerCase();
  if (isRateLimited(rateLimitKey)) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  let isValid: boolean;
  try {
    isValid = await verifyAdminCredentials(
      parsed.data.email,
      parsed.data.password,
    );
  } catch {
    return { error: "Admin login is not configured yet." };
  }

  if (!isValid) {
    recordFailedAttempt(rateLimitKey);
    return { error: "Incorrect email or password." };
  }

  clearAttempts(rateLimitKey);
  await createSession(parsed.data.email);
  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
