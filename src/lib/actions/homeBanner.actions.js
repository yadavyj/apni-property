"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { homeBannerSchema } from "@/lib/validations/homeBanner.schema";
import { CACHE_TAGS } from "@/lib/cacheTags";

function refreshHomeBanners() {
  updateTag(CACHE_TAGS.homeBanners);
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function createHomeBanner(rawData) {
  await requireAdmin();
  const data = homeBannerSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_banners").insert(data);

  if (error) throw new Error(error.message);

  refreshHomeBanners();
}

export async function updateHomeBanner(id, rawData) {
  await requireAdmin();
  const data = homeBannerSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_banners").update(data).eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeBanners();
}

export async function deleteHomeBanner(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_banners").delete().eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeBanners();
}

export async function toggleHomeBannerActive(id, isActive) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("home_banners")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeBanners();
}

export async function reorderHomeBanners(orderedIds) {
  await requireAdmin();
  const supabase = createAdminClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("home_banners").update({ sort_order: index }).eq("id", id)
    )
  );

  refreshHomeBanners();
}
