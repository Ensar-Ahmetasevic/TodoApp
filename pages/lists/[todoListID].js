import TodoForm from "@/components/todo/todo-items/todo-components/todo-form";
import { getSession } from "next-auth/client";
import { Fragment } from "react";

function HomePage() {
  return (
    <Fragment>
      <section className="  pt-8 ">
        <TodoForm />
      </section>
    </Fragment>
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
