import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal(""))
    .nullable(),
  message: z.string().optional().nullable(),
  property_id: z.string().uuid().optional().nullable(),
  referral_code: z.string().optional().nullable(),
});
