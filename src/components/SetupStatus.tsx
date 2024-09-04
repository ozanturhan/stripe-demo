import React, { FC, FormEvent, useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const Status: FC<{ clientSecret: string }> = ({ clientSecret }) => {
  const stripe = useStripe();

  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the SetupIntent
    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      console.log({ setupIntent });
      // Inspect the SetupIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (setupIntent?.status) {
        case "succeeded":
          setMessage("Success! Your payment method has been saved.");
          break;

        case "processing":
          setMessage(
            "Processing payment details. We'll update you when processing is complete.",
          );
          break;

        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage(
            "Failed to process payment details. Please try another payment method.",
          );
          break;
      }
    });
  }, [stripe]);

  return message;
  return <div>bok</div>;
};

export default Status;
