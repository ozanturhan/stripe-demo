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

type Customer = string | null;

const Customer = ({
  customer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const createCustomerMutation = useMutation({
    mutationFn: (email: string) => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", process.env.NEXT_PUBLIC_APP_TOKEN!);

      return fetch(`${process.env.NEXT_PUBLIC_API}/stripe/create-customer`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: email }),
      }).then((res) => res.json());
    },
  });

  const loginMutation = useMutation({
    mutationFn: (customerId: string) =>
      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ customerId: customerId }),
      }),
  });

  const handleSubmit = async () => {
    const { customer } = await createCustomerMutation.mutateAsync(email);

    await loginMutation.mutateAsync(customer);

    router.reload();
  };

  if (customer) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col">
          <span>Registered Customer: {customer}</span>

          <Link href="/reservation" className="text-blue-500">
            Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="customer-email">Email</label>
          <input
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="Email"
            id="customer-email"
            className="border border-gray-500 rounded p-2 "
          />
        </div>
        <button
          className="bg-blue-500 text-white rounded p-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
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
