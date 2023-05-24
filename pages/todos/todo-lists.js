import { Fragment } from "react";

import Layout from "@/components/layout/layout";
import AllTodoLists from "@/components/todo/todo-lists/all-todo-lists";
import FormTodoList from "@/components/todo/todo-lists/form-todo-list";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";
import TodoListQuery from "@/requests/requests-for-todo-lists/todo-list-query";
import { getServerSideProps } from "@/helpers/verification-of-user-auth";

function TodoListsHP() {
  const { isLoading, isError, error } = TodoListQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;
  return (
    <Layout>
      <Fragment>
        <section className="pt-8">
          <FormTodoList />
          <AllTodoLists />
        </section>
      </Fragment>
    </Layout>
  );
}

export { getServerSideProps };

export default TodoListsHP;
