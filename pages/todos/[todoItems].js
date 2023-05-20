import { getSession } from "next-auth/client";
import { Fragment } from "react";

import AllItems from "@/components/todo/todo-items/all-items";
import TodoForm from "@/components/todo/todo-items/todo-form";
import Layout from "@/components/layout/layout";

function HomePage() {
  return (
    <Layout>
      <Fragment>
        <section className="pt-8 ">
          <TodoForm />
          <AllItems />
        </section>
      </Fragment>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default HomePage;
