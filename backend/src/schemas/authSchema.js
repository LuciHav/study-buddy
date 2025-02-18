import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "First name is required"),
    email: z
      .string()
      .email("Please enter a valid email")
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be of minimum 6 length"),
    confirmPassword: z.string().min(6, "Password must be of minimum 6 length"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  verificationCode: z
    .string()
    .min(6, "Verification code must be 6 character long")
    .max(6, "Verification code must be 6 character long"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    verificationCode: z
      .string()
      .min(6, "Verification code must be 6 character long")
      .max(6, "Verification code must be 6 character long"),
    password: z.string().min(6, "Password must be of minimum 6 length"),
    confirmPassword: z.string().min(6, "Password must be of minimum 6 length"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
  });

