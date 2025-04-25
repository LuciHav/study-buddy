import express from "express";
import { createContact, getAllContacts, updateContactStatus, deleteContact } from "../controllers/contactController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", authenticate, getAllContacts);
router.patch("/:id", authenticate, updateContactStatus);
router.delete("/:id", authenticate, deleteContact);

export default router;