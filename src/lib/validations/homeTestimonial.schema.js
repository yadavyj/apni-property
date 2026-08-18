import { z } from "zod";

export const homeTestimonialSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_role: z.string().optional().nullable(),
  message: z.string().min(2, "Message is required"),
  rating: z.number().min(1).max(5).optional(),
  avatar_public_id: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().optional(),
});
