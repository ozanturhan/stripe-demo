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

    /*const subscription = await stripe.subscriptions.create({
      customer: customerId!,
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
      metadata: {
        rezervationId: "sa3d324fsdaf234klsj2323efdd4324332424dkfhskhdfk",
      },
      billing_cycle_anchor: 1730678400,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });*/

    /*    if (subscription.latest_invoice) {
      const invoiceId = (subscription.latest_invoice as Stripe.Invoice)?.id;

      await stripe.invoices.pay(invoiceId, {
        paid_out_of_band: true,
      });
    }*/

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }

  res.status(200).json({ no: "mo" });
}
