"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { homeTestimonialSchema } from "@/lib/validations/homeTestimonial.schema";
import { CACHE_TAGS } from "@/lib/cacheTags";

function refreshHomeTestimonials() {
  updateTag(CACHE_TAGS.homeTestimonials);
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function createHomeTestimonial(rawData) {
  await requireAdmin();
  const data = homeTestimonialSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_testimonials").insert(data);

  if (error) throw new Error(error.message);

  refreshHomeTestimonials();
}

export async function updateHomeTestimonial(id, rawData) {
  await requireAdmin();
  const data = homeTestimonialSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_testimonials").update(data).eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeTestimonials();
}

export async function deleteHomeTestimonial(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_testimonials").delete().eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeTestimonials();
}

export async function reorderHomeTestimonials(orderedIds) {
  await requireAdmin();
  const supabase = createAdminClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("home_testimonials").update({ sort_order: index }).eq("id", id)
    )
  );

  refreshHomeTestimonials();
}
