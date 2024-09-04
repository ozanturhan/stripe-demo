import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React from "react";
import SetupForm from "@/components/SetupForm";
import { useQuery } from "react-query";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const Payment = () => {
  const { data } = useQuery({
    queryFn: () => fetch("api/setup-intent").then((res) => res.json()),
  });

  const options = {
    clientSecret: data?.clientSecret,
  };

  return data?.clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <SetupForm />
    </Elements>
  ) : null;
};

export default Payment;
