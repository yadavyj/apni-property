import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { signUploadParams } from "@/lib/cloudinary/signature";

export async function POST(request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { paramsToSign } = body;

  const signature = signUploadParams(paramsToSign);

  return NextResponse.json({ signature });
}
