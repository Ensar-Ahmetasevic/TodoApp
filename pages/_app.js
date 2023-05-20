import "@/styles/tailwind.css";
import "@/styles/globals.css";
import { getSession } from "next-auth/client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { Provider } from "next-auth/client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider session={pageProps.session}>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          closeButton={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="text-center mt-16"
          toastClassName="bg-gray-900 text-white"
          bodyClassName="text-sm"
        />
        <Component {...pageProps} />
      </Provider>
    </QueryClientProvider>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/12",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
