import { Fragment } from "react";
import { getServerSideProps } from "@/helpers/getServerSideProps";

import Layout from "@/components/layout/layout";
import TodoAllLists from "@/components/todo/todo-lists/todo-all-lists";
import TodoListForm from "@/components/todo/todo-lists/todo-list-form";
import LoadingSpinner from "@/helpers/loading-spiner";
import TodoListQuery from "@/requests/requests-for-todo-lists/todo-list-query";

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

export { getServerSideProps };

export default TodoListsHP;
