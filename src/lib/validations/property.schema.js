import { z } from "zod";

export const landmarkSchema = z.object({
  name: z.string().min(1, "Landmark name is required"),
  distance_km: z.coerce.number().min(0, "Distance must be positive"),
});

export const propertySchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional().nullable(),
  category: z.enum(["plot", "flat", "house", "commercial", "agricultural"]),
  status: z.enum(["draft", "published", "sold", "archived"]).default("draft"),

  location_area: z.string().min(2, "Location is required"),
  location_city: z.string().min(2).default("Gorakhpur"),
  location_state: z.string().min(2).default("Uttar Pradesh"),

  size_display: z.string().optional().nullable(),
  size_width_ft: z.coerce.number().optional().nullable(),
  size_length_ft: z.coerce.number().optional().nullable(),
  area_sqft: z.coerce.number().positive("Area must be greater than 0"),
  rate_per_sqft: z.coerce.number().positive("Rate must be greater than 0"),

  road_width_ft: z.coerce.number().optional().nullable(),
  registry_status: z.enum([
    "registry_kabza_tatkal",
    "registry_only",
    "kabza_only",
    "under_process",
  ]),
  emi_available: z.boolean().default(false),
  is_featured: z.boolean().default(false),

  landmarks: z.array(landmarkSchema).default([]),
});
