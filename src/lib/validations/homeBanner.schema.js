import { z } from "zod";

export const homeBannerSchema = z.object({
  image_public_id: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  eyebrow_text: z.string().optional().nullable(),
  heading: z.string().min(2, "Heading is required"),
  subheading: z.string().optional().nullable(),
  cta_label: z.string().optional().nullable(),
  cta_href: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().optional(),
});
