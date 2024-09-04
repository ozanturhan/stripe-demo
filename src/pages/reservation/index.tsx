import Cookies from "cookies";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import SetupForm from "@/components/SetupForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from "@/components/Payment";

type Customer = string | null;

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const Customer = ({
  customer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [isReserving, setIsReserving] = useState<boolean>(false);

  const handleReserving = async () => {
    setIsReserving(true);
  };

  if (!customer) {
    return router.push("customer");
  }

  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="flex justify-center">
        <div className="flex flex-col">
          <button
            className="bg-blue-500 text-white rounded p-2"
            onClick={handleReserving}
          >
            Make Reservation
          </button>
        </div>
      </div>

      {isReserving && <Payment />}
    </div>
  );
};

export const getServerSideProps = (async ({ req, res }) => {
  // Fetch data from external API
  const cookies = new Cookies(req, res);
  const customer = (cookies.get("customer") as string) || null;
  // Pass data to the page via props
  return { props: { customer } };
}) satisfies GetServerSideProps<{ customer: Customer }>;

export default Customer;
