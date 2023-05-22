import { Fragment } from "react";

import AllItems from "@/components/todo/todo-items/all-items";
import TodoForm from "@/components/todo/todo-items/todo-form";
import Layout from "@/components/layout/layout";
import { getServerSideProps } from "@/helpers/getServerSideProps";
import TodoItemsQuery from "@/requests/requests-for-todo-items/todo-items-query";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";

function HomePage() {
  const { isLoading, isError, error } = TodoItemsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;
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

export { getServerSideProps };

export default HomePage;
