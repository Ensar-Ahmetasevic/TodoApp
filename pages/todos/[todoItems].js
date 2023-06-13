import { Fragment } from "react";

import AllTodoItems from "@/components/pages/todo/todo-items/all-todo-items";
import FormTodoItem from "@/components/pages/todo/todo-items/form-todo-item";
import Layout from "@/components/pages/layout/layout";
import { getServerSideProps } from "@/components/shared/verification-of-user-auth";
import useTodoItemsQuery from "@/requests/requests-for-todo-items/use-todo-items-query";
import LoadingSpinner from "@/components/shared/loading-spiner";
import ErrorNotification from "@/components/shared/error";

function HomePage() {
  const { isLoading, isError, error } = useTodoItemsQuery();

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
