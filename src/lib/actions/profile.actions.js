"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/profile.schema";

export async function updateMyProfile(rawData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const data = profileSchema.parse(rawData);

  const { error } = await supabase.from("profiles").update(data).eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
