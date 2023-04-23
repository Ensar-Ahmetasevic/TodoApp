import TodoForm from "@/components/todo/todo-form";
import { getSession } from "next-auth/client";

function HomePage() {
  return (
    <section className="flex flex-row pt-8 ">
      <div className="center">
        <TodoForm />
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

export default HomePage;
