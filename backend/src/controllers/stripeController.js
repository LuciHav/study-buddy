import Booking from "../models/Booking.js";
import Tutor from "../models/Tutor.js";
import { BOOKING_STATUS } from "../constants/index.js";
import stripe from "../services/stripe.js";
import HttpError from "../utils/HttpError.js";
import keys from "../configs/keys.js";

export const createCheckoutSession = async (req, res, next) => {
  const { tutorId, hours } = req.body;
  const userId = req.user.id;

  const tutor = await Tutor.findByPk(tutorId);
  if (!tutor) throw new HttpError(404, `Tutor with id ${tutorId} not found`);

  const customer = await stripe.customers.create({
    email: req.user.email,
    name: req.user.firstName + " " + req.user.lastName,
    metadata: { userId, tutorId, hours },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer: customer.id,
    line_items: [
      {
        price_data: {
          currency: "npr",
          unit_amount: Math.round(tutor.hourlyRate * 100),
          product_data: {
            name: tutor.firstName + " " + tutor.lastName,
            description: tutor.bio,
          },
        },
        quantity: hours,
      },
    ],
    success_url: keys.stripe.successUrl,
    cancel_url: keys.stripe.cancelUrl + "/" + tutorId,
  });

  res.status(200).json({
    success: true,
    message: "Checkout session created successfully",
    session,
  });
};

export const createStripeWebhook = async (req, res) => {
  let event;

  const signature = req.headers["stripe-signature"];

  if (!keys.stripe.webhookKey) {
    console.error("❌ Stripe webhook key is missing in config.");
    return res.sendStatus(500);
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      keys.stripe.webhookKey
    );
    console.log(`🔑 Stripe webhook verified: ${event.id}`);
  } catch (err) {
    console.error("⚠️ Stripe webhook signature verification failed.", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId = session.customer;
      const paymentIntentId = session.payment_intent;
      const amountTotal = session.amount_total;

      try {
        const customer = await stripe.customers.retrieve(customerId);

        const { userId, tutorId, hours } = customer?.metadata || {};

        if (!userId || !tutorId || !hours) {
          console.error(
            "🚫 Missing metadata: userId, tutorId, or hours not found in Stripe customer."
          );
          return res
            .status(400)
            .send("Missing metadata in Stripe customer object.");
        }

        await Booking.create({
          userId,
          tutorId,
          hours: parseInt(hours),
          totalAmount: amountTotal / 100,
          status: BOOKING_STATUS.CONFIRMED,
          paymentIntentId,
        });

        console.log(
          `✅ Booking confirmed: User ${userId} booked Tutor ${tutorId} for ${hours} hour(s).`
        );
      } catch (err) {
        console.error("❌ Failed to create booking from Stripe webhook.", err);
        return res.sendStatus(500);
      }

      break;
    }

    default:
      console.warn(`⚠️ Unhandled Stripe event type: ${event.type}`);
      break;
  }

  res.status(200).send("Event received");
};
