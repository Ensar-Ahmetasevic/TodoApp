import { Fragment } from "react";
import { getServerSideProps } from "@/helpers/getServerSideProps";

import Layout from "@/components/layout/layout";
import TodoAllLists from "@/components/todo/todo-lists/todo-all-lists";
import TodoListForm from "@/components/todo/todo-lists/todo-list-form";

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

export { getServerSideProps };

export default TodoListsHP;
