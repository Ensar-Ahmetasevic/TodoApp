import { useForm } from "react-hook-form";
import { ListMutations } from "../list-react-query/list-mutations";

import ErrorNotification from "@/helpers/error";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import LoadingSpinner from "@/helpers/loading-spiner";
import AllLists from "./all-lists";

function TodoList() {
  const { createListMutation, isLoading, isError, error } = ListMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function newListHandler(data) {
    //"data" from react-hook-form
    const newList = data.newListInput;

    createListMutation.mutateAsync({ listName: newList });
    reset(); // Reset the form after submission
  }

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <ErrorNotification error={error} />;

  return (
    <section>
      <h1 className="text-xl font-bold">Create your new ToDo List</h1>
      <form onSubmit={handleSubmit(newListHandler)}>
        <div className="mt-2 mb-6 ">
          <input
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-96"
            type="text"
            placeholder="Enter your new todo list"
            maxLength={500}
            {...register("newListInput", { required: true })}
          />
          <button
            className="ml-4 p-2 border-2 rounded-md hover:bg-sky-700"
            type="submit"
            disabled={createListMutation.isLoading}
          >
            {createListMutation.isLoading ? <LoadingSpinnerButton /> : "Add"}
          </button>
        </div>
      </form>

      <AllLists />
    </section>
  );
}

export default TodoList;
