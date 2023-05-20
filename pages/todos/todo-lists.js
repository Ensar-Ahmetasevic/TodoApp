import { getSession } from "next-auth/client";
import { Fragment } from "react";

import Layout from "@/components/layout/layout";
import TodoAllLists from "@/components/todo/todo-lists/todo-all-lists";
import TodoListForm from "@/components/todo/todo-lists/todo-list-form";

import TodoListQuery from "@/requests/requests-for-todo-lists/todo-list-query";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";

function TodoListsHP() {
  const { isLoading, isError, error } = TodoListQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

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
