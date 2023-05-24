import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import TodoListQuery from "../../../../requests/requests-for-todo-lists/todo-list-query";
import TodoListMutations from "../../../../requests/requests-for-todo-lists/todo-list-mutations";
import LoadingSpinner from "@/helpers/loading-spiner";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";

function SingleTodoList({ list }) {
  const [listData, setListData] = useState(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { isLoading } = TodoListQuery();
  const { updateListMutation, toggleisCompleteMutation, deleteListMutation } =
    TodoListMutations();

  function ListDataFetcher(list) {
    setListData(list);
  }

  const updateListHandler = (data) => {
    // data from react-hook-form
    const name = data.name;
    const id = listData.id;

    updateListMutation.mutateAsync({ id, name });
    setListData(null);
  };

  function toggleisCompleteHandler(id, isComplete) {
    toggleisCompleteMutation.mutateAsync({ id, isComplete: !isComplete });
    setListData(null);
  }

  function deleteListHandler(id) {
    deleteListMutation.mutateAsync(id);
  }

  return (
    <li
      className={`col-start-2 col-span-4 rounded-lg my-10 py-3 border-4 border-solid hover:bg-gray-800 
      ${
        list.isComplete === false
          ? "border-green-600 hover:border-green-400"
          : "border-red-600 hover:border-red-400"
      } `}
    >
      <div className="grid grid-cols-8 gap-2">
        {/*  */}
        <div className="col-start-1 col-end-6 mx-5 sm:col-start-1 sm:col-span-5 sm:ml-5 sm:mr-0 ">
          <input
            className="w-4 h-4 mb-2 mr-3 cursor-pointer sm:h-3 sm:w-3 accent-red-500"
            type="checkbox"
            id={list.id}
            name={list.id}
            checked={list.isComplete} // enables the isComplete to remember the value (true or false), i.e. if it is "true", it will remember and keep that little check mark
            onChange={() => {
              toggleisCompleteHandler(list.id, list.isComplete);
            }}
          />
          <label
            className={`mx-1 text-xl sm:text-lg 
            ${list.isComplete ? "line-through text-slate-400" : ""}`}
            htmlFor={list.id}

            // htmlFor={list.isComplete.toString()}
            //If we want to write the htmlFor attribute to the DOM with a boolean value, we need to convert it to a string.
          >
            {toggleisCompleteMutation.isLoading ? (
              <>
                <LoadingSpinner />
                {list.name}
              </>
            ) : (
              list.name
            )}
          </label>
        </div>

        <div className="col-span-2 col-end-10 sm:text-xs sm:col-span-3">
          <div className="flex justify-end mr-5 sm:mr-2">
            <div className="flex-col">
              <p className="text-left sm:text-right">
                <b>Created:</b> <br />
                {dayjs(list.createdAt).format("DD/MM/YYYY")}
              </p>
              {dayjs(list.createdAt).isSame(list.updatedAt, "day") ? (
                ""
              ) : (
                <p className="mt-1 text-left sm:text-right">
                  <b>Last update:</b> <br />
                  {dayjs(list.updatedAt).format("DD/MM/YYYY")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-3 col-end-9 py-3 mx-2 border-2 border-gray-500 border-solid rounded-lg sm:col-end-9 sm:col-span-3 sm:border-0 sm:mr-2 sm:ml-0 hover:border-gray-100">
          {list.isComplete ? (
            <div className="sm:flex sm:justify-end">
              <button
                className="px-2 border-2 rounded-md hover:bg-rose-600"
                onClick={() => deleteListHandler(list.id)}
              >
                {deleteListMutation.isLoading ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          ) : (
            <>
              <div className="sm:flex sm:justify-end">
                <button
                  className="p-1.5 border-2 rounded-md  hover:bg-green-600 md:ml-2 sm:px-1 sm:p-0"
                  onClick={() => router.push(`/todos/${list.id}`)}
                >
                  {isLoading ? <LoadingSpinnerButton /> : "Open"}
                </button>
              </div>
              <div className="sm:flex sm:justify-end">
                <button
                  className="px-2 mx-3 mt-3 mb-3 border-2 rounded-md  hover:bg-amber-400 sm:mx-0 sm:mt-2 sm:mb-2"
                  onClick={() => ListDataFetcher(list)}
                >
                  {updateListMutation.isLoading ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
              <div className="sm:flex sm:justify-end">
                <button
                  className="px-2 border-2 rounded-md  hover:bg-rose-600"
                  onClick={() => deleteListHandler(list.id)}
                >
                  {deleteListMutation.isLoading ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
      {listData ? ( // if "listData" is null it will no be visible"
        <section className="grid grid-cols-6 gap-4">
          <div className="col-span-4 col-start-2 sm:col-start-1 sm:col-span-6 sm:mx-4 ">
            <form
              className="max-w-md mx-auto mt-5"
              onSubmit={handleSubmit(updateListHandler)}
            >
              <div className="flex">
                <input
                  className="w-full p-2 font-bold border border-gray-300 rounded-md text-slate-800 sm:text-sm"
                  type="text"
                  defaultValue={listData.name}
                  {...register("name")}
                  // defaultValu + entered text we can access that value using the registered field named "name".
                />
              </div>

              <div className="mt-5">
                <button
                  className="px-2 mr-1 border-2 rounded-md  hover:bg-amber-400"
                  type="submit"
                >
                  Update
                </button>
                <button
                  className="px-2 ml-1 border-2 rounded-md hover:bg-slate-500"
                  onClick={() => setListData(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}
    </li>
  );
}

export default SingleTodoList;
