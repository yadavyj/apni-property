import { unstable_cache } from "next/cache";
import { createPublicClient, createAdminClient, withSupabaseTimeout } from "@/lib/supabase/server";
import { CACHE_TAGS, PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cacheTags";

const getCachedActiveHomeFaqs = unstable_cache(
  async function fetchActiveHomeFaqs() {
    return withSupabaseTimeout(async () => {
      const supabase = createPublicClient();
      if (!supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from("home_faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.warn("getActiveHomeFaqs:", error.message);
        return [];
      }
      return data || [];
    }, [], 4000, "getActiveHomeFaqs");
  },
  [CACHE_TAGS.homeFaqs],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.homeFaqs],
  }
);

export async function getActiveHomeFaqs() {
  return getCachedActiveHomeFaqs();
}

export async function getAllHomeFaqs() {
  const supabase = createAdminClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("home_faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("getAllHomeFaqs:", error.message);
    return [];
  }
  return data || [];
}
