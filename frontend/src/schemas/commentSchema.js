import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().nonempty("Comment is required"),
  parentId: z.string().uuid().optional(),
  image: z.instanceof(File).optional(),
});
