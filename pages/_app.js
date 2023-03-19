import "@/styles/tailwind.css";
import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { Provider } from "next-auth/client";

import Layout from "@/components/layout/layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-center items-center justify-center h-screen bg-gray-700 text-gray-100">
        <Provider session={pageProps.session}>
          <Layout>
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
          </Layout>
        </Provider>
      </div>
    </QueryClientProvider>
  );
}
