import { unstable_cache } from "next/cache";
import { createPublicClient, createAdminClient, withSupabaseTimeout } from "@/lib/supabase/server";
import { CACHE_TAGS, PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cacheTags";

function normalizeBannerImage(banner) {
  if (!banner) return banner;

  const imagePublicId = banner.image_public_id;
  const imageUrl = banner.image_url;

  if (imageUrl || !imagePublicId) {
    return banner;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return banner;
  }

  return {
    ...banner,
    image_url: `https://res.cloudinary.com/${cloudName}/image/upload/${imagePublicId}`,
  };
}

const getCachedActiveHomeBanners = unstable_cache(
  async function fetchActiveHomeBanners() {
    return withSupabaseTimeout(async () => {
      const supabase = createPublicClient();

      const { data, error } = await supabase
        .from("home_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        // Falls back to the Hero component's built-in default slides — most
        // commonly because the 0003_home_banners.sql migration hasn't been run
        // against this Supabase project yet.
        console.warn("getActiveHomeBanners:", error.message);
        return [];
      }

      return (data || []).map(normalizeBannerImage);
    }, [], 4000, "getActiveHomeBanners");
  },
  [CACHE_TAGS.homeBanners],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.homeBanners],
  }
);

export async function getActiveHomeBanners() {
  return getCachedActiveHomeBanners();
}

export async function getAllHomeBanners() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("home_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("getAllHomeBanners:", error.message);
    return [];
  }
  return data || [];
}
