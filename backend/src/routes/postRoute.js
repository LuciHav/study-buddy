import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import upload from "../middlewares/multerMiddleware.js";
import validate from "../middlewares/validatorMiddleware.js";
import { postSchema } from "../schemas/postSchema.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, upload.single("image"), validate(postSchema), createPost);
router.get("/", authenticate, getAllPosts);
router.get("/:id", authenticate, getPostById);
router.put("/:id", authenticate, upload.single("image"), validate(postSchema), updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
