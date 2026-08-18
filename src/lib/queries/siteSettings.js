import { unstable_cache } from "next/cache";
import { createPublicClient, createAdminClient } from "@/lib/supabase/server";
import { BUSINESS } from "@/lib/constants";
import { CACHE_TAGS, PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cacheTags";

// Merges DB-stored settings over the hardcoded BUSINESS defaults, so the
// site keeps working with its current look even if a field has never been
// set, or the 0004_site_settings.sql migration hasn't been run yet.
const getCachedSiteSettings = unstable_cache(
  async function fetchSiteSettings() {
    const supabase = createPublicClient();

    if (!supabase) {
      return { ...BUSINESS };
    }

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.warn("getSiteSettings:", error.message);
      return { ...BUSINESS };
    }

    const instagram = data?.instagram_handle || BUSINESS.instagram;

    return {
      ...BUSINESS,
      whatsappNumber: data?.whatsapp_number || BUSINESS.whatsappNumber,
      email: data?.email || BUSINESS.email,
      instagram,
      instagramUrl: `https://www.instagram.com/${instagram}`,
      facebookUrl: data?.facebook_url || null,
      youtubeUrl: data?.youtube_url || null,
      twitterUrl: data?.twitter_url || null,
      city: data?.city || BUSINESS.city,
      state: data?.state || BUSINESS.state,
      addressLine: data?.address_line || null,
    };
  },
  [CACHE_TAGS.siteSettings],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.siteSettings],
  }
);

export async function getSiteSettings() {
  return getCachedSiteSettings();
}

export async function getRawSiteSettings() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.warn("getRawSiteSettings:", error.message);
    return null;
  }
  return data;
}
