import { useForm } from "react-hook-form";

import TodoListMutations from "../../../requests/requests-for-todo-lists/todo-list-mutations";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";

function FormTodoList() {
  const { createListMutation } = TodoListMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function newListHandler(data) {
    //"data" from react-hook-form.
    const newList = data.newListInput;

    createListMutation.mutateAsync({ listName: newList });

    reset(); // Reset the form after submission
  }

  return (
    <section className="grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className="col-start-2 col-span-4 sm:col-start-1 sm:col-span-7">
        <h1 className="text-xl font-bold mb-5">Create your new ToDo List</h1>

        <form
          className="max-w-md mx-auto"
          onSubmit={handleSubmit(newListHandler)}
        >
          <div className="mt-2 mb-6 flex">
            <input
              className="border border-gray-300 font-bold text-slate-800 rounded-md px-3 w-full sm:text-sm"
              type="text"
              placeholder="Enter your new todo list"
              maxLength={500}
              {...register("newListInput", { required: true })}
            />

            <div>
              <button
                className="ml-4 p-2 border-2 rounded-md hover:bg-sky-700"
                type="submit"
                disabled={createListMutation.isLoading}
              >
                {createListMutation.isLoading ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FormTodoList;
