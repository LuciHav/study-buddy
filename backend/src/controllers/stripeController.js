import keys from "../configs/keys.js";
import { BOOKING_STATUS } from "../constants/index.js";
import Booking from "../models/Booking.js";
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";
import stripe from "../services/stripe.js";
import HttpError from "../utils/HttpError.js";

export const createCheckoutSession = async (req, res, next) => {
  const { bookingId } = req.body;
  const userId = req.user.id;

  // Find the booking that should be in APPROVED status
  const booking = await Booking.findByPk(bookingId, {
    include: {
      model: User,
      as: "tutor",
      include: {
        model: Tutor,
        as: "tutorProfile",
      }
    }
  });

  if (!booking) {
    throw new HttpError(404, `Booking with id ${bookingId} not found`);
  }

  // Verify the booking belongs to the current user
  if (booking.userId !== userId) {
    throw new HttpError(403, "You are not authorized to pay for this booking");
  }

  // Verify booking is in APPROVED status
  if (booking.status !== BOOKING_STATUS.APPROVED && booking.status !== BOOKING_STATUS.PENDING) {
    throw new HttpError(400, "This booking must be in APPROVED or PENDING status");
  }

  const tutor = booking.tutor;
  if (!tutor || !tutor.tutorProfile) {
    throw new HttpError(404, "Tutor information not found");
  }
  
  const customer = await stripe.customers.create({
    email: req.user.email,
    name: req.user.firstName + " " + req.user.lastName,
    metadata: { 
      bookingId: booking.id,
      userId, 
      tutorId: booking.tutorId, 
      hours: booking.hours 
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer: customer.id,
    line_items: [
      {
        price_data: {
          currency: "npr",
          unit_amount: Math.round(tutor.tutorProfile.hourlyRate * 100),
          product_data: {
            name: tutor.firstName + " " + tutor.lastName,
            description: tutor.tutorProfile.bio,
          },
        },
        quantity: booking.hours,
      },
    ],
    success_url: keys.stripe.successUrl,
    cancel_url: keys.stripe.cancelUrl + "/" + booking.tutorId,
  });

  // Update booking status to PENDING
  booking.status = BOOKING_STATUS.PENDING;
  await booking.save();

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

        const { bookingId, userId, tutorId, hours } = customer?.metadata || {};

        if (!bookingId || !userId || !tutorId || !hours) {
          console.error(
            "🚫 Missing metadata: bookingId, userId, tutorId, or hours not found in Stripe customer."
          );
          return res
            .status(400)
            .send("Missing metadata in Stripe customer object.");
        }

        // Find the existing booking and update it
        const booking = await Booking.findByPk(bookingId);
        
        if (!booking) {
          console.error(`❌ Booking with id ${bookingId} not found`);
          return res.status(400).send(`Booking not found`);
        }

        // Update booking status and payment details
        booking.status = BOOKING_STATUS.CONFIRMED;
        booking.paymentIntentId = paymentIntentId;
        booking.totalAmount = amountTotal / 100;
        await booking.save();

        console.log(
          `✅ Booking confirmed: User ${userId} booked Tutor ${tutorId} for ${hours} hour(s).`
        );
      } catch (err) {
        console.error("❌ Failed to update booking from Stripe webhook.", err);
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
