import Layout from "@/components/layout/layout";
import TodoAllLists from "@/components/todo/todo-lists/todo-all-lists";
import TodoListForm from "@/components/todo/todo-lists/todo-list-form";
import { getSession } from "next-auth/client";
import { Fragment } from "react";

function TodoListsHP() {
  return (
    <Layout>
      <Fragment>
        <section className="pt-8 ">
          <TodoListForm />
          <TodoAllLists />
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

export default TodoListsHP;