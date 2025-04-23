import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    }),
});

export const updateUserPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z
      .string()
      .min(6, "Confirm new password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must match",
    path: ["confirmNewPassword"],
  });

export const updateUserSchema = userSchema.partial();
