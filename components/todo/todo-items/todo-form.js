import { useForm } from "react-hook-form";

import TodoItemMutations from "@/requests/requests-for-todo-items/todo-items-mutations";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";

function TodoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { createTodoMutation } = TodoItemMutations();

  function sendTextItemHandler(data) {
    //"data" from react-hook-form
    const enteredTodo = data.todoInput;

    createTodoMutation.mutateAsync({ text: enteredTodo, isComplete: false });
    reset(); // Reset the form after submission
  }

  return (
    <section className=" grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className=" col-start-2 col-span-4 sm:col-start-1 sm:col-span-7">
        <label className=" text-xl font-bold mb-5">
          Please enter your ToDo`s
        </label>
        <form
          className="max-w-md mx-auto mt-4"
          onSubmit={handleSubmit(sendTextItemHandler)}
        >
          <div className="flex sm:flex-col">
            <textarea
              className="w-full bg-transparent px-3 py-3 text-slate-100 rounded-md sm:text-sm  border border-r-4 border-l-4 border-gray-500 focus:ring-1 focus:r-ring-gray-500 focus:outline-none"
              style={{
                maxHeight: "200px",
                height: "120px",
                overflow: "hidden",
              }}
              placeholder="Enter your new todo ..."
              maxLength={1000}
              {...register("todoInput", { required: true })}
            />

            <div>
              <button
                className="ml-4 p-2 sm:ml-0 mt-9 sm:mt-4 border-2 rounded-md hover:bg-sky-700"
                type="submit"
                disabled={createTodoMutation.isLoading}
              >
                {createTodoMutation.isLoading ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>

          <div className="italic text-gray-300 text-sm mt-3">
            {errors.todoInput && <p> This field is required </p>}
          </div>
        </form>
      </div>
    </section>
  );
}

export default TodoForm;
