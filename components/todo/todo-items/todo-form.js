import { useForm } from "react-hook-form";

import { TodoMutations } from "./todo-react-query/todo-mutations";
import LoadingSpinner from "@/helpers/loading-spiner";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import ErrorNotification from "@/helpers/error";

import AllItems from "./all-items";

function TodoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { isLoading, isError, error, createTodoMutation } = TodoMutations();

  function sendTextItemHandler(data) {
    //"data" from react-hook-form
    const enteredTodo = data.todoInput;

    createTodoMutation.mutateAsync({ text: enteredTodo, checkBox: false });
    reset(); // Reset the form after submission
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section className=" grid grid-cols-6 gap-4 mx-20">
      <div className=" col-start-2 col-span-4">
        <h2 className=" text-xl font-bold">Please enter your ToDo`s</h2>
        <form
          className="max-w-md mx-auto"
          onSubmit={handleSubmit(sendTextItemHandler)}
        >
          <div className=" mt-2 mb-6 flex">
            <input
              className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full sm:text-sm"
              type="text"
              placeholder="Enter a new todo item"
              maxLength={1000}
              {...register("todoInput", { required: true })}
            />
            <button
              className="ml-4 p-2 border-2 rounded-md hover:bg-sky-700"
              type="submit"
              disabled={createTodoMutation.isLoading}
            >
              {createTodoMutation.isLoading ? <LoadingSpinnerButton /> : "Add"}
            </button>
          </div>
          <div className="mt-2 italic text-gray-300 text-sm">
            {errors.todoInput && <p> This field is required </p>}
          </div>
        </form>
      </div>
      <section className=" col-start-2 col-span-4 ">
        <AllItems />
      </section>
    </section>
  );
}

export default TodoForm;
