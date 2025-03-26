import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { createCheckoutSession } from "../controllers/stripeController.js";
import { getAllBooking, getBookingById } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", authenticate, createCheckoutSession)
router.get("/", authenticate, getAllBooking);
router.get("/:bookingId", authenticate, getBookingById);

export default router;
