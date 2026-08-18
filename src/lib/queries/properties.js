import { unstable_cache } from "next/cache";
import { createPublicClient, createAdminClient, withSupabaseTimeout } from "@/lib/supabase/server";
import { CACHE_TAGS, PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cacheTags";

const MEDIA_SELECT =
  "id, media_type, cloudinary_public_id, secure_url, width, height, duration, sort_order";

// properties <-> property_media has two FK paths (property_media.property_id,
// and properties.cover_media_id), so PostgREST needs the FK name to disambiguate.
const MEDIA_EMBED = `property_media!property_media_property_id_fkey(${MEDIA_SELECT})`;
const CARD_MEDIA_SELECT = "id, media_type, cloudinary_public_id, secure_url, sort_order";
const CARD_MEDIA_EMBED =
  `property_media!property_media_property_id_fkey(${CARD_MEDIA_SELECT})`;
const CARD_SELECT = [
  "id",
  "title",
  "slug",
  "category",
  "location_area",
  "location_city",
  "area_sqft",
  "rate_per_sqft",
  "total_price",
  "registry_status",
  "emi_available",
  "is_featured",
  "cover_media_id",
  CARD_MEDIA_EMBED,
].join(", ");

function hasSupabaseConfig() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function warnSupabaseIssue(context, error) {
  console.warn(`${context}:`, error instanceof Error ? error.message : error);
}

async function fetchFilteredProperties(searchParams) {
  const fallbackResult = {
    properties: [],
    total: 0,
    page: Number(searchParams?.page) || 1,
    pageSize: 9,
    totalPages: 1,
  };

  return withSupabaseTimeout(async () => {
    if (!hasSupabaseConfig()) {
      console.warn("fetchFilteredProperties: missing Supabase env configuration");
      return fallbackResult;
    }

    const supabase = createPublicClient();
    const page = Number(searchParams.page) || 1;
    const pageSize = 9;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("properties")
      .select(CARD_SELECT, { count: "exact" })
      .eq("status", "published");

    if (searchParams.search) {
      const term = searchParams.search.trim().replace(/[,()%]/g, "");
      if (term) {
        query = query.or(
          `title.ilike.%${term}%,location_area.ilike.%${term}%,location_city.ilike.%${term}%`
        );
      }
    }
    if (searchParams.category) query = query.eq("category", searchParams.category);
    if (searchParams.location_state) query = query.eq("location_state", searchParams.location_state);
    if (searchParams.location_city) query = query.eq("location_city", searchParams.location_city);
    if (searchParams.location_area) query = query.eq("location_area", searchParams.location_area);
    if (searchParams.registry_status)
      query = query.eq("registry_status", searchParams.registry_status);
    if (searchParams.emi === "true") query = query.eq("emi_available", true);
    if (searchParams.min_price) query = query.gte("rate_per_sqft", Number(searchParams.min_price));
    if (searchParams.max_price) query = query.lte("rate_per_sqft", Number(searchParams.max_price));
    if (searchParams.min_area) query = query.gte("area_sqft", Number(searchParams.min_area));
    if (searchParams.max_area) query = query.lte("area_sqft", Number(searchParams.max_area));

    const sort = searchParams.sort || "newest";
    if (sort === "price_asc") query = query.order("rate_per_sqft", { ascending: true });
    else if (sort === "price_desc") query = query.order("rate_per_sqft", { ascending: false });
    else if (sort === "area_desc") query = query.order("area_sqft", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.range(from, to);

    try {
      const { data, count, error } = await query;
      if (error) {
        warnSupabaseIssue("fetchFilteredProperties", error);
        return fallbackResult;
      }

      return {
        properties: (data || []).map(sortMedia),
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
      };
    } catch (error) {
      warnSupabaseIssue("fetchFilteredProperties", error);
      return fallbackResult;
    }
  }, fallbackResult, 5000, "fetchFilteredProperties");
}

const getCachedFilteredProperties = unstable_cache(
  fetchFilteredProperties,
  ["filtered-properties"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.properties],
  }
);

export async function getFilteredProperties(searchParams = {}) {
  return getCachedFilteredProperties(searchParams);
}

async function fetchFeaturedProperties(limit) {
  return withSupabaseTimeout(async () => {
    if (!hasSupabaseConfig()) {
      console.warn("fetchFeaturedProperties: missing Supabase env configuration");
      return [];
    }

    try {
      const supabase = createPublicClient();

      const { data, error } = await supabase
        .from("properties")
        .select(CARD_SELECT)
        .eq("status", "published")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        warnSupabaseIssue("fetchFeaturedProperties", error);
        return [];
      }
      return (data || []).map(sortMedia);
    } catch (error) {
      warnSupabaseIssue("fetchFeaturedProperties", error);
      return [];
    }
  }, [], 5000, "fetchFeaturedProperties");
}

const getCachedFeaturedProperties = unstable_cache(
  fetchFeaturedProperties,
  ["featured-properties"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.properties],
  }
);

export async function getFeaturedProperties(limit = 8) {
  return getCachedFeaturedProperties(limit);
}

// Admin-only: every listing with just the fields the "Featured Properties"
// picker needs, featured ones first so the current selection is on top.
export async function getPropertiesForFeaturedPicker() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, title, slug, category, status, location_area, location_city, total_price, rate_per_sqft, is_featured, cover_media_id, ${MEDIA_EMBED}`
    )
    .order("is_featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("getPropertiesForFeaturedPicker:", error.message);
    return [];
  }
  return (data || []).map(sortMedia);
}

async function fetchPropertyBySlug(slug) {
  if (!hasSupabaseConfig()) {
    console.warn("fetchPropertyBySlug: missing Supabase env configuration");
    return null;
  }

  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("properties")
      .select(`*, ${MEDIA_EMBED}`)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      warnSupabaseIssue("fetchPropertyBySlug", error);
      return null;
    }
    return data ? sortMedia(data) : null;
  } catch (error) {
    warnSupabaseIssue("fetchPropertyBySlug", error);
    return null;
  }
}

const getCachedPropertyBySlug = unstable_cache(
  fetchPropertyBySlug,
  ["property-by-slug"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.properties],
  }
);

export async function getPropertyBySlug(slug) {
  if (!slug) return null;
  return getCachedPropertyBySlug(slug);
}

async function fetchRelatedProperties(propertyId, category, limit) {
  if (!hasSupabaseConfig()) {
    console.warn("fetchRelatedProperties: missing Supabase env configuration");
    return [];
  }

  try {
    const supabase = createPublicClient();

    let query = supabase
      .from("properties")
      .select(CARD_SELECT)
      .neq("id", propertyId);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      warnSupabaseIssue("fetchRelatedProperties", error);
      return [];
    }
    return (data || []).map(sortMedia);
  } catch (error) {
    warnSupabaseIssue("fetchRelatedProperties", error);
    return [];
  }
}

const getCachedRelatedProperties = unstable_cache(
  fetchRelatedProperties,
  ["related-properties"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.properties],
  }
);

export async function getRelatedProperties(property, limit = 4) {
  if (!property) return [];
  return getCachedRelatedProperties(property.id, property.category, limit);
}

async function fetchDistinctLocations() {
  if (!hasSupabaseConfig()) {
    console.warn("fetchDistinctLocations: missing Supabase env configuration");
    return [];
  }

  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("properties")
      .select("location_area")
      .eq("status", "published");

    if (error) {
      warnSupabaseIssue("fetchDistinctLocations", error);
      return [];
    }

    const counts = new Map();
    (data || []).forEach(({ location_area }) => {
      counts.set(location_area, (counts.get(location_area) || 0) + 1);
    });

    return Array.from(counts.entries()).map(([location_area, count]) => ({
      location_area,
      count,
    }));
  } catch (error) {
    warnSupabaseIssue("fetchDistinctLocations", error);
    return [];
  }
}

const getCachedDistinctLocations = unstable_cache(
  fetchDistinctLocations,
  ["distinct-property-locations"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.properties],
  }
);

export async function getDistinctLocations() {
  return getCachedDistinctLocations();
}

async function fetchLocationHierarchy() {
  if (!hasSupabaseConfig()) {
    console.warn("fetchLocationHierarchy: missing Supabase env configuration");
    return [];
  }

  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("properties")
      .select("location_state, location_city, location_area")
      .eq("status", "published");

    if (error) {
      warnSupabaseIssue("fetchLocationHierarchy", error);
      return [];
    }

    const states = new Map();
    for (const row of data || []) {
      const state = row.location_state;
      const city = row.location_city;
      const area = row.location_area;

      if (!states.has(state)) states.set(state, new Map());
      const cities = states.get(state);

      if (!cities.has(city)) cities.set(city, new Map());
      const areas = cities.get(city);

      areas.set(area, (areas.get(area) || 0) + 1);
    }

    return Array.from(states.entries())
      .map(([state, cities]) => ({
        state,
        cities: Array.from(cities.entries())
          .map(([city, areas]) => ({
            city,
            areas: Array.from(areas.entries())
              .map(([area, count]) => ({ area, count }))
              .sort((a, b) => a.area.localeCompare(b.area)),
          }))
          .sort((a, b) => a.city.localeCompare(b.city)),
      }))
      .sort((a, b) => a.state.localeCompare(b.state));
  } catch (error) {
    warnSupabaseIssue("fetchLocationHierarchy", error);
    return [];
  }
}

const getCachedLocationHierarchy = unstable_cache(
  fetchLocationHierarchy,
  ["property-location-hierarchy"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.properties],
  }
);

export async function getLocationHierarchy() {
  return getCachedLocationHierarchy();
}

async function fetchSiteStats() {
  if (!hasSupabaseConfig()) {
    console.warn("fetchSiteStats: missing Supabase env configuration");
    return {
      totalProperties: 0,
      totalLocations: 0,
      totalCategories: 0,
    };
  }

  try {
    const supabase = createPublicClient();

    const [{ count: totalProperties }, { data: rows }] = await Promise.all([
      supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("properties")
        .select("location_area, category")
        .eq("status", "published"),
    ]);

    const locations = new Set((rows || []).map((r) => r.location_area));
    const categories = new Set((rows || []).map((r) => r.category));

    return {
      totalProperties: totalProperties || 0,
      totalLocations: locations.size,
      totalCategories: categories.size,
    };
  } catch (error) {
    warnSupabaseIssue("fetchSiteStats", error);
    return {
      totalProperties: 0,
      totalLocations: 0,
      totalCategories: 0,
    };
  }
}

const getCachedSiteStats = unstable_cache(fetchSiteStats, ["property-site-stats"], {
  revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.properties],
});

export async function getSiteStats() {
  return getCachedSiteStats();
}

function sortMedia(property) {
  return {
    ...property,
    property_media: [...(property.property_media || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}
