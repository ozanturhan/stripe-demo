import React, { FC, FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "react-query";
import { useAuthContext } from "@/pages/context/AuthContext";

const SetupForm: FC<{ onCardAdded: () => void }> = ({ onCardAdded }) => {
  const stripe = useStripe();
  const elements = useElements();
  const auth = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const setupIntentMutation = useMutation({
    mutationFn: () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", process.env.NEXT_PUBLIC_APP_TOKEN!);

      return fetch(
        `${process.env.NEXT_PUBLIC_API}/stripe/create-setup-intent`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ customerId: auth?.customer }),
        },
      ).then((res) => res.json());
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return null;
    }

    const { error: err } = await elements.submit();

    console.log({ err });

    const response = await setupIntentMutation.mutateAsync();

    const { error, setupIntent } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret: response.clientSecret,
      confirmParams: {
        return_url: "http://localhost:3000/setup/status",
      },
      redirect: "if_required",
    });

    if (setupIntent?.status === "succeeded") {
      onCardAdded();
    }

    console.log({ setupIntent });
    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button>Submit</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default SetupForm;
