import express from "express";
import {
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";
import validate from "../middlewares/validatorMiddleware.js";
import {
  updateUserPasswordSchema,
  updateUserSchema,
} from "../schemas/userSchema.js";

const router = express.Router();

router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  validate(updateUserSchema),
  updateUser
);

router.patch(
  "/update-password",
  authenticate,
  validate(updateUserPasswordSchema),
  updateUserPassword
);

export default router;
