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
import PaymentList from "@/components/PaymentList";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const Payment = () => {
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const {
    data: paymentMethods,
    isLoading: isPaymentsLoading,
    isFetched: isPaymentsFetched,
  } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => fetch("/api/payment-methods").then((res) => res.json()),
    retry: false,
  });

  if (paymentMethods) {
    return (
      <div className="flex flex-col">
        <Elements
          stripe={stripePromise}
          options={{ mode: "setup", currency: "usd" }}
        >
          <PaymentList />

          <SetupForm />
        </Elements>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default Payment;
