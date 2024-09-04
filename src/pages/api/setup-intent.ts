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

  let customerId = cookies.get("customer");

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: "deneme@deneme.com",
    });

    cookies.set("customer", customer.id, {
      httpOnly: true, // true by default
    });

    customerId = customer.id;

    // stripe.customers.update(customerId, {default_source: })
  }

  const intent = await stripe.setupIntents.create({
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.status(200).json({ clientSecret: intent.client_secret });
}
