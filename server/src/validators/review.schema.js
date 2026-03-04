import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(50),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(500),
});
