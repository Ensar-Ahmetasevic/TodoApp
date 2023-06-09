import { Fragment } from "react";

import Layout from "@/components/pages/layout/layout";
import AllTodoLists from "@/components/pages/todo/todo-lists/all-todo-lists";
import FormTodoList from "@/components/pages/todo/todo-lists/form-todo-list";
import LoadingSpinner from "@/components/shared/loading-spiner";
import ErrorNotification from "@/components/shared/error";
import useTodoListQuery from "@/requests/requests-for-todo-lists/use-todo-list-query";
import { getServerSideProps } from "@/components/shared/verification-of-user-auth";

function TodoListsHP() {
  const { isLoading, isError, error } = useTodoListQuery();

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
