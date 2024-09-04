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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const PaymentList = () => {
  const stripe = useStripe();
  const elements = useElements();

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

  const makePaymentMutation = useMutation({
    mutationFn: (paymentMethod: string) =>
      fetch("/api/make-payment", {
        method: "POST",
        body: JSON.stringify({ payment: paymentMethod }),
      }).then((res) => res.json()),
  });

  const authenticatePaymentMutation = useMutation({
    mutationFn: (paymentMethod: string) =>
      fetch("/api/auth-payment", {
        method: "POST",
        body: JSON.stringify({ payment: paymentMethod }),
      }).then((res) => res.json()),
  });

  const handlePayment = async () => {
    console.log("handlePayment");
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return null;
    }

    let response = await makePaymentMutation.mutateAsync(selectedPaymentId);

    if (response.status === "succeeded") {
      return alert("Payment is done!");
    }

    if (response?.last_payment_error?.code === "authentication_required") {
      response =
        await authenticatePaymentMutation.mutateAsync(selectedPaymentId);
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      clientSecret: response.client_secret,
      confirmParams: {
        return_url: "http://localhost:3000/payment/status",
      },
      redirect: "if_required",
    });

    if (paymentIntent?.status === "succeeded") {
      return alert("Payment is done!");
    }
  };

  if (paymentMethods) {
    return (
      <div className="flex flex-col">
        <select onChange={(e) => setSelectedPaymentId(e.currentTarget.value)}>
          <option>Select</option>
          {paymentMethods.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.card.display_brand}***-{payment.card.last4}
            </option>
          ))}
        </select>
        <button onClick={handlePayment}>Pay</button>
      </div>
    );
  }
};

export default PaymentList;
