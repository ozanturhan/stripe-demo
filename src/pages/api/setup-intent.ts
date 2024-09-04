import { Stripe } from "stripe";
import Cookies from "cookies";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  clientSecret: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const cookies = new Cookies(req, res);

  const customerId = cookies.get("customer");

  const intent = await stripe.setupIntents.create({
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(200).json({ clientSecret: intent.client_secret });
}
