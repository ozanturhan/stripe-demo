import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React from "react";
import SetupForm from "@/components/SetupForm";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import SetupStatus from "@/components/SetupStatus";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const PaymentStatus = () => {
  const router = useRouter();

  const clientSecret = router.query.setup_intent_client_secret as string;

  const options = {
    clientSecret,
  };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <SetupStatus clientSecret={clientSecret} />
    </Elements>
  ) : null;
};

export default PaymentStatus;
