import { z } from "zod";

export const tutorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be of minimum 6 length"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  subject: z.array(z.string()).min(1, "At least one subject is required"),
  experience: z.array(z.string()).optional(),
  hourlyRate: z.string().min(1, "Hourly rate must be at least 1"),
});

export const editTutorSchema = tutorSchema.partial();
