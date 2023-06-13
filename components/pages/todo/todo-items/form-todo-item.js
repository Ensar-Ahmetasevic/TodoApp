import { useForm } from "react-hook-form";

import LoadingSpinnerButton from "@/components/shared/loading-spiner-button";
import useCreateTodoItemMutation from "@/requests/requests-for-todo-items/use-create-todo-item-mutation";

function FormTodoItem() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createTodoItemMutation = useCreateTodoItemMutation();

  function sendTextItemHandler(data) {
    //"data" from react-hook-form
    const enteredTodo = data.todoInput.trim();

    if (enteredTodo === "") {
      reset();
      return;
    }

    createTodoItemMutation.mutateAsync({
      text: enteredTodo,
      isComplete: false,
    });
    reset(); // Reset the form after submission
  }

  return (
    <section className="grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className="col-span-4 col-start-2 sm:col-start-1 sm:col-span-7">
        <label className="mb-5 text-xl font-bold ">
          Please enter your ToDo`s
        </label>
        <form
          className="max-w-md mx-auto mt-4"
          onSubmit={handleSubmit(sendTextItemHandler)}
        >
          <div className="flex sm:flex-col">
            <textarea
              className="w-full px-3 py-3 bg-transparent border border-l-4 border-r-4 border-gray-500 rounded-md text-slate-100 sm:text-sm focus:ring-1 focus:r-ring-gray-500 focus:outline-none"
              style={{
                maxHeight: "200px",
                height: "120px",
                overflow: "auto",
              }}
              placeholder="Enter your new todo ..."
              maxLength={1000}
              {...register("todoInput", { required: true })}
            />

            <div>
              <button
                className="p-2 ml-4 border-2 rounded-md sm:ml-0 mt-9 sm:mt-4 hover:bg-sky-700"
                type="submit"
                disabled={createTodoItemMutation.isLoading}
              >
                {createTodoItemMutation.isLoading ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 text-sm italic text-gray-300">
            {errors.todoInput && (
              <p>
                This field is required. <br /> Pleas enter your Todo Item.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default FormTodoItem;
