import { useForm } from "react-hook-form";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import useCreateTodoListMutation from "@/requests/requests-for-todo-lists/use-create-todo-list-mutation";

function FormTodoList() {
  const createTodoListMutation = useCreateTodoListMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function newListHandler(data) {
    //"data" from react-hook-form.
    const newListName = data.newListInput.trim(); // Remove leading and trailing whitespace

    if (newListName === "") {
      reset();
      return;
    }

    createTodoListMutation.mutateAsync({ listName: newListName });

    reset(); // Reset the form after submission.
  }

  return (
    <section className="grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className="col-span-4 col-start-2 sm:col-start-1 sm:col-span-7">
        <h1 className="mb-5 text-xl font-bold">Create your new ToDo List</h1>

        <form
          className="max-w-md mx-auto"
          onSubmit={handleSubmit(newListHandler)}
        >
          <div className="flex mt-2 mb-6">
            <input
              className="w-full px-3 font-bold border border-gray-300 rounded-md text-slate-800 sm:text-sm"
              type="text"
              placeholder="Enter your new todo list"
              maxLength={500}
              {...register("newListInput", { required: true })}
            />

            <div>
              <button
                className="p-2 ml-4 border-2 rounded-md hover:bg-sky-700"
                type="submit"
                disabled={createTodoListMutation.isLoading}
              >
                {createTodoListMutation.isLoading ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
          <div className="mt-3 text-sm italic text-gray-300">
            {errors.newListInput && (
              <p>
                This field is required. <br /> Please enter your Todo List name.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default FormTodoList;
