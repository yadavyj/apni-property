import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/adminAuth/jwt";

export async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Not authorized");
  }
  return user;
}
