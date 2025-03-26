import express from "express";
import { createStripeWebhook } from "../controllers/stripeController.js";

const router = express.Router();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  createStripeWebhook
);

export default router;
