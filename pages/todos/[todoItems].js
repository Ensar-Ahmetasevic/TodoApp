import { Fragment } from "react";

import AllTodoItems from "@/components/todo/todo-items/all-todo-items";
import FormTodoItem from "@/components/todo/todo-items/form-todo-item";
import Layout from "@/components/layout/layout";
import { getServerSideProps } from "@/helpers/verification-of-user-auth";
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
        <section className="pt-8">
          <FormTodoItem />
          <AllTodoItems />
        </section>
      </Fragment>
    </Layout>
  );
}

export { getServerSideProps };

export default HomePage;
