"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { siteSettingsSchema } from "@/lib/validations/siteSettings.schema";
import { CACHE_TAGS } from "@/lib/cacheTags";

export async function updateSiteSettings(rawData) {
  await requireAdmin();
  const data = siteSettingsSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...data });

  if (error) throw new Error(error.message);

  updateTag(CACHE_TAGS.siteSettings);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
}
