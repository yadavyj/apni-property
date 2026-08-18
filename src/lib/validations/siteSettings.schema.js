import { z } from "zod";

export const siteSettingsSchema = z.object({
  whatsapp_number: z.string().optional().nullable(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")).nullable(),
  instagram_handle: z.string().optional().nullable(),
  facebook_url: z.string().optional().nullable(),
  youtube_url: z.string().optional().nullable(),
  twitter_url: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  address_line: z.string().optional().nullable(),
});
