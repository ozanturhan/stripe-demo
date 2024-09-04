import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextPageContext } from "next";
import Cookies from "cookies";
import { AuthContextProvider } from "@/pages/context/AuthContext";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider customer={pageProps.customer}>
        <Component {...pageProps} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

App.getInitialProps = async (ctx: NextPageContext) => {
  if (ctx.req && ctx.res) {
    const cookies = Cookies(ctx.req, ctx.res);
    const customer = cookies.get("customer");

    return { customer };
  }

  return {};
};
