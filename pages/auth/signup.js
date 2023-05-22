import Layout from "@/components/layout/layout";
import SignupForm from "@/components/auth/signup-form";

import { getSession } from "next-auth/client";

function SignupPage() {
  return (
    <Layout>
      <SignupForm />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // We have access to the request object through "context" when are using "getServerSideProps". And we pass this request into "getSession" function
  // through that "req" key. And then, "getSession" will automatically look into that request and extract the data it needs like "session token cookie"
  // and see if that's valid, and if the user is authenticated and if that cookie even exists.
  // So it will tell us if user is login or not, and based on that we will deside are we going to render this page or not. So this checking we be done
  // behind the scenes. So the user will see the "loading" process.

  const session = await getSession({ req: context.req });

  // And "session" will be null if the user is "not authenticated", and it will be a valid session object if the user is "authenticated".

  if (session) {
    return {
      redirect: {
        destination: "/todos/todo-lists",
        permanent: false,
        // Adding "permanent" to indicate if that's a permanent redirect, which will always apply, or only a temporary one. And here we want to set
        // "permanent" to "false" to make it clear that it's only this time that we redirect because the user is not logged in.
      },
    };
  }

  return {
    props: { session },
  };
}

export default SignupPage;
