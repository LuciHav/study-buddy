import Stripe from "stripe";
import keys from "../configs/keys.js";

const stripe = new Stripe(keys.stripe.secretKey);

export default stripe;
