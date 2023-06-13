import "@/styles/tailwind.css";
import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { Provider as AuthProvider } from "next-auth/client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/client";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider session={pageProps.session}>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

// export async function getServerSideProps(context) {
//   // We have access to the request object through "context" when are using "getServerSideProps". And we pass this request into "getSession" function
//   // through that "req" key. And then, "getSession" will automatically look into that request and extract the data it needs like "session token cookie"
//   // and see if that's valid, and if the user is authenticated and if that cookie even exists.
//   // So it will tell us if user is login or not, and based on that we will deside are we going to render this page or not. So this checking we be done
//   // behind the scenes. So the user will see the "loading" process.

//   const session = await getSession({ req: context.req });

//   // "session" will be null if the user is "not authenticated", and it will be a valid session object if the user is "authenticated".

//   if (session) {
//     if (
//       context.pathname === "/auth/login" ||
//       context.pathname === "/auth/signup"
//     ) {
//       return {
//         redirect: {
//           destination: "/todos/todo-lists",
//           permanent: false,
//           // Adding "permanent" to indicate if that's a permanent redirect, which will always apply, or only a temporary one. And here we want to set
//           // "permanent" to "false" to make it clear that it's only this time that we redirect because the user is not logged in.
//         },
//       };
//     }
//   } else if (!session) {
//     if (context.pathname === "/user-profile") {
//       return {
//         redirect: {
//           destination: "/",
//           permanent: false,
//         },
//       };
//     }
//   }

//   return {
//     props: { session },
//   };
// }
