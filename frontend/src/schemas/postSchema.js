import { z } from "zod";
import { SUBJECTS } from "../constants/index.js";

export const postSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  image: z.instanceof(File).optional(),
  subject: z.enum(Object.values(SUBJECTS), {
    errorMap: () => ({ message: "Subject is required" }),
  }),
});
