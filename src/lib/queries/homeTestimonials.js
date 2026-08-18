import { unstable_cache } from "next/cache";
import { createPublicClient, createAdminClient, withSupabaseTimeout } from "@/lib/supabase/server";
import { CACHE_TAGS, PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cacheTags";

const getCachedActiveHomeTestimonials = unstable_cache(
  async function fetchActiveHomeTestimonials() {
    return withSupabaseTimeout(async () => {
      const supabase = createPublicClient();

      const { data, error } = await supabase
        .from("home_testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.warn("getActiveHomeTestimonials:", error.message);
        return [];
      }
      return data || [];
    }, [], 4000, "getActiveHomeTestimonials");
  },
  [CACHE_TAGS.homeTestimonials],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.homeTestimonials],
  }
);

export async function getActiveHomeTestimonials() {
  return getCachedActiveHomeTestimonials();
}

export async function getAllHomeTestimonials() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("home_testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("getAllHomeTestimonials:", error.message);
    return [];
  }
  return data || [];
}
