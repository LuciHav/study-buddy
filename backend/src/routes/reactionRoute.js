import express from "express";
import {
  updateReaction
} from "../controllers/reactionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.put("/", authenticate, updateReaction);

export default router;
