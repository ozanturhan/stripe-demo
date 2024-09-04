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

  const { payment } = JSON.parse(req.body);

  const paymentMethod = payment || paymentMethods.data[0].id;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    customer: customerId,
    payment_method: paymentMethod,
    metadata: {
      reservationId: "afkjhsdkhfskdfhksjdhfkjsdh",
    },
  });

  const subscription = await stripe.subscriptionSchedules.create({
    customer: customerId,
    start_date: 1728138055,
    end_behavior: "release",
    phases: [
      {
        end_date: 1730733655,
        billing_cycle_anchor: "phase_start",
        default_payment_method: paymentMethod,
        items: [
          {
            price_data: {
              currency: "usd",
              product: "prod_Qmcm8S6Ydk22hP",
              unit_amount: 1099,
              recurring: {
                interval: "month",
              },
            },
          },
        ],
      },
    ],
  });
  res.status(200).json(paymentIntent);
}
