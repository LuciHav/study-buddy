import { z } from "zod";

export const tutorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  subject: z.array(z.string()).min(1, "At least one subject is required"),
  experience: z.array(z.string()).optional(),
  hourlyRate: z.number().min(1, "Hourly rate must be at least 1"),
  image: z
    .instanceof(FileList, "Image is required")
    .refine((files) => files.length > 0, "Image is required"),
});