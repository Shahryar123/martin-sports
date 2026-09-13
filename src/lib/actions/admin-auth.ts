"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/auth/admin";
import { createSession, destroySession } from "@/lib/auth/session";
import { adminLoginSchema } from "@/lib/validations/auth";

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
    return { error: "Incorrect email or password." };
  }

  await createSession(parsed.data.email);
  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
