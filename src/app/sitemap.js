import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const staticRoutes = ["", "/properties", "/about", "/contact"].map((path) => ({
    url: `${BUSINESS.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const supabase = await createClient();

  if (!supabase) {
    return staticRoutes;
  }

  const { data: properties } = await supabase
    .from("properties")
    .select("slug, updated_at")
    .eq("status", "published");

  const propertyRoutes = (properties || []).map((property) => ({
    url: `${BUSINESS.siteUrl}/properties/${property.slug}`,
    lastModified: property.updated_at,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
