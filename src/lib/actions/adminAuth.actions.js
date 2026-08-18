"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
  signAdminToken,
} from "@/lib/adminAuth/jwt";
import { hashPassword, verifyPassword } from "@/lib/adminAuth/password";

export async function adminLogin({ email, password }) {
  const supabase = createAdminClient();

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, email, password_hash")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (!admin) {
    return { success: false, error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, admin.password_hash);
  if (!valid) {
    return { success: false, error: "Invalid email or password." };
  }

  const token = await signAdminToken({ id: admin.id, email: admin.email });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, ADMIN_SESSION_COOKIE_OPTIONS);

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function changeAdminPassword({ currentPassword, newPassword }) {
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  const { data: row } = await supabase
    .from("admin_users")
    .select("id, password_hash")
    .eq("id", admin.id)
    .single();

  const valid = await verifyPassword(currentPassword, row.password_hash);
  if (!valid) {
    throw new Error("Current password is incorrect.");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const password_hash = await hashPassword(newPassword);
  const { error } = await supabase
    .from("admin_users")
    .update({ password_hash })
    .eq("id", admin.id);

  if (error) throw new Error(error.message);

  return { success: true };
}

// One-time bootstrap: only works while admin_users is empty, so the real
// owner can set their own email/password instead of one being hardcoded in
// a migration file. Becomes inert (throws) the moment an admin exists.
export async function bootstrapAdmin({ email, password }) {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true });

  if ((count || 0) > 0) {
    throw new Error("An admin account already exists.");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const password_hash = await hashPassword(password);
  const { error } = await supabase
    .from("admin_users")
    .insert({ email: email.trim().toLowerCase(), password_hash });

  if (error) throw new Error(error.message);

  return { success: true };
}
