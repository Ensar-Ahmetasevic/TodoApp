import TodoList from "@/components/todo/todo-lists/todo-list-components/todo-list-form";
import { getSession } from "next-auth/client";

function TodoListsHP() {
  return (
    <section className="flex flex-row pt-8 ">
      <div className="ceneter">
        <TodoList />
      </div>
    </section>
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
