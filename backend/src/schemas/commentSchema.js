import { z } from "zod";

export const commentSchema = z.object({
  comment: z.string().nonempty("Comment is required"),
  parentId: z.union([z.string().uuid(), z.number()]).optional(),
});
