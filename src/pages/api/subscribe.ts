import { Stripe } from "stripe";
import Cookies from "cookies";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  clientSecret: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookies = new Cookies(req, res);

  const customerId = cookies.get("customer");

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });

  const paymentMethod = paymentMethods.data[0].id;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      payment_method: paymentMethod,
      return_url: "https://example.com/order/123/complete",
      off_session: true,
      confirm: true,
    });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log(err);
  }

  res.status(200).json({ no: "mo" });
}
