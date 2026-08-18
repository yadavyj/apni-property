import { z } from "zod";

export const homeFaqSchema = z.object({
  question: z.string().min(2, "Question is required"),
  answer: z.string().min(2, "Answer is required"),
  is_active: z.boolean().optional(),
  sort_order: z.number().optional(),
});
