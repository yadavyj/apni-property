"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { homeFaqSchema } from "@/lib/validations/homeFaq.schema";
import { CACHE_TAGS } from "@/lib/cacheTags";

function refreshHomeFaqs() {
  updateTag(CACHE_TAGS.homeFaqs);
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function createHomeFaq(rawData) {
  await requireAdmin();
  const data = homeFaqSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_faqs").insert(data);

  if (error) throw new Error(error.message);

  refreshHomeFaqs();
}

export async function updateHomeFaq(id, rawData) {
  await requireAdmin();
  const data = homeFaqSchema.parse(rawData);
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_faqs").update(data).eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeFaqs();
}

export async function deleteHomeFaq(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("home_faqs").delete().eq("id", id);

  if (error) throw new Error(error.message);

  refreshHomeFaqs();
}

export async function reorderHomeFaqs(orderedIds) {
  await requireAdmin();
  const supabase = createAdminClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("home_faqs").update({ sort_order: index }).eq("id", id)
    )
  );

  refreshHomeFaqs();
}
