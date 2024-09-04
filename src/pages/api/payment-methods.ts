import { Stripe } from "stripe";
import Cookies from "cookies";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stripe.PaymentMethod[]>,
) {
  const cookies = new Cookies(req, res);

  const customerId = cookies.get("customer");

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
  });

  res.status(200).json(paymentMethods.data);
}
