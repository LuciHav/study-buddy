import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  resetPassword,
  signupUser,
  verifyEmail,
} from "../controllers/authController.js";
import validate from "../middlewares/validatorMiddleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from "../schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signupUser);

authRouter.patch("/verify-email", validate(verifyEmailSchema), verifyEmail);

authRouter.post("/login", validate(loginSchema), loginUser);

authRouter.patch("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

authRouter.patch("/reset-password", validate(resetPasswordSchema), resetPassword);

export default authRouter;
