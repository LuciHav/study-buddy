import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.post("/", authenticate, upload.single("file"), sendMessage);
router.get("/:contactId", authenticate, upload.single("file"), getMessages);

export default router;
