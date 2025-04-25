import { z } from "zod";

export const commentSchema = z
  .object({
    comment: z.string().optional(),
    parentId: z.union([z.string(), z.number()]).optional(),
    image: z.instanceof(File).optional(),
  })
  .refine((data) => data.comment || data.image, {
    message: "Either comment or image is required",
  });
