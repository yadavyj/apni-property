import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_COOKIE_OPTIONS, signAdminToken } from "@/lib/adminAuth/jwt";
import { verifyPassword } from "@/lib/adminAuth/password";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Admin authentication is not configured." }, { status: 500 });
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: "Unable to sign in right now." }, { status: 500 });
    }

    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signAdminToken({ id: admin.id, email: admin.email });
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, ADMIN_SESSION_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? "Unable to sign in right now." : "Invalid email or password.",
      },
      { status: 500 }
    );
  }
}
