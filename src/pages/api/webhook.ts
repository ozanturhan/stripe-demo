import { Stripe } from "stripe";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const signature = req.headers["stripe-signature"] as string;

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
    } catch (err) {
      console.log(err);
      return;
    }

    console.log(event.type, event.data);

    if (event.type === "invoice.paid") {
      console.log(event?.data?.object?.subscription_details?.metadata);
    }

    res.json({ received: true });
  }
}
