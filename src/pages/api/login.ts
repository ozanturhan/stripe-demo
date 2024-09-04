import { Stripe } from "stripe";
import Cookies from "cookies";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  customer: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const cookies = new Cookies(req, res);

  const { customerId } = JSON.parse(req.body);

  cookies.set("customer", customerId, {
    httpOnly: true, // true by default
  });

  res.status(200).json({ customer: customerId });
}
