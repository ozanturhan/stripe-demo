import React, { useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "react-query";
import SetupForm from "@/components/SetupForm";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  const { data: paymentMethods, refetch } = useQuery({
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

  // creates separate payment
  const handlePayment = async () => {
    console.log("handlePayment");
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return null;
    }

    const response = await makePaymentMutation.mutateAsync(selectedPaymentId);

    const { paymentIntent } = await stripe.confirmPayment({
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label>Select Payment Method</label>
          <select
            className="p-2 rounded border-r-8 border-transparent px-2 text-sm outline outline-neutral-700"
            onChange={(e) => setSelectedPaymentId(e.currentTarget.value)}
          >
            <option>Select</option>
            {paymentMethods.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.card.display_brand}-***-{payment.card.last4}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 text-white rounded p-1"
          onClick={handlePayment}
        >
          Pay
        </button>

        <button
          className="bg-blue-500 text-white rounded p-1"
          onClick={() => setIsAddingNewCard(true)}
        >
          Add new Payment
        </button>

        {isAddingNewCard && (
          <SetupForm
            onCardAdded={() => {
              setIsAddingNewCard(false);
              refetch();
            }}
          />
        )}
      </div>
    );
  }
};

export default PaymentForm;
