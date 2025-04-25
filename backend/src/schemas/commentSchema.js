import { z } from "zod";

export const commentSchema = z.object({
  comment: z.string().optional(),
  parentId: z.union([z.string(), z.number()]).optional(),
  image: z.string().optional(),
});
