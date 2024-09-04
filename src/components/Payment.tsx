import React, { FormEvent, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "react-query";
import { loadStripe } from "@stripe/stripe-js";
import SetupForm from "@/components/SetupForm";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const Payment = () => {
  return (
    <div className="flex flex-col">
      <Elements
        stripe={stripePromise}
        options={{ mode: "setup", currency: "usd" }}
      >
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default Payment;
