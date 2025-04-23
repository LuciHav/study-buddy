import { z } from "zod";

export const reportSchema = z.object({
  postId: z.any(),
  reason: z.string().min(20, "Reason must be at least 20 characters"),
});
