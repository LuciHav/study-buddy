import express from "express";
import {
  createComment,
  deleteComment,
  getAllComment,
  getCommentById,
  updateComment,
} from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validatorMiddleware.js";
import { commentSchema } from "../schemas/commentSchema.js";

const router = express.Router({mergeParams: true});

router.post("/", authenticate, validate(commentSchema), createComment);
router.get("/", authenticate, getAllComment);
router.get("/:id", authenticate, getCommentById);
router.put("/:id", authenticate, validate(commentSchema), updateComment);
router.delete("/:id", authenticate, deleteComment);

export default router;
