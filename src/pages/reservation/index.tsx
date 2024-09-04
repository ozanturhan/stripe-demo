import Cookies from "cookies";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";

type Customer = string | null;

const Customer = ({
  customer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const createCustomerMutation = useMutation({
    mutationFn: () =>
      fetch("/api/create-customer/", {
        method: "POST",
        body: JSON.stringify({ email: email }),
      }),
  });

  const handleSubmit = async () => {
    await createCustomerMutation.mutateAsync();
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
        <button onClick={handleSubmit}>Submit</button>
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
