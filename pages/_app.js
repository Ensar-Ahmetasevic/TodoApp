import "@/styles/tailwind.css";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="flex justify-center h-screen bg-gray-700 text-gray-100 pt-10">
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
}
