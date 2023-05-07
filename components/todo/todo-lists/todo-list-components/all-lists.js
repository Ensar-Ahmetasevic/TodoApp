import { useState } from "react";
import _ from "lodash";
import Link from "next/link";

import { ListMutations } from "../list-react-query/list-mutations";
import LoadingSpinner from "@/helpers/loading-spiner";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import ErrorNotification from "@/helpers/error";

function AllLists() {
  const [editList, setEditList] = useState(null);
  const [deletingListId, setDeletingListId] = useState(null);
  const [updateListId, setUpdateListId] = useState(null);

  const {
    isLoading,
    isError,
    error,
    data,
    updateListMutation,
    toggleCheckBoxMutation,
    deleteListMutation,
  } = ListMutations();

  function updateListHandler(list) {
    setEditList(list);
  }

  function updateListItem(id, name) {
    setUpdateListId(id);
    updateListMutation.mutateAsync({ id, name });
    setEditList(null);
  }

  function toggleCheckBoxHandler(id, checkBox) {
    toggleCheckBoxMutation.mutateAsync({ id, checkBox: !checkBox });
  }

  function deleteListHandler(id) {
    setDeletingListId(id);
    deleteListMutation.mutateAsync(id);
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section>
      <ul>
        {_.sortBy(data.allLists).map((list) => (
          <div className="my-3 p-3 rounded-lg border-4 border-solid border-green-600 hover:border-green-400">
            <li className="my-3" key={list.id} style={{ listStyle: "none" }}>
              <input
                className="mr-1 mb-2"
                type="checkbox"
                id={list.id}
                name={list.id}
                checked={list.checkBox} // enables the checkbox to remember the value (true or false), i.e. if it is "true", it will remember and keep that little check mark
                onChange={() => {
                  toggleCheckBoxHandler(list.id, list.checkBox);
                }}
              />
              <label
                className={`mx-1 text-xl ${list.checkBox ? "checked" : ""}`}
                htmlFor={list.checkBox.toString()}
                // If we want to write the htmlFor attribute to the DOM with a boolean value, we need to convert it to a string
              >
                {list.name}
              </label>

              <div className="  flex-row flex-initial w-1/3 py-2 mt-10 border-2 border-solid border-gray-500 hover:border-gray-100 rounded-lg ">
                {list.checkBox ? (
                  <button
                    className="px-2 border-2 rounded-md  hover:bg-rose-600"
                    onClick={() => deleteListHandler(list.id)}
                  >
                    {deleteListMutation.isLoading &&
                    deletingListId === list.id ? (
                      <LoadingSpinnerButton />
                    ) : (
                      "Delete"
                    )}
                  </button>
                ) : (
                  <>
                    <div>
                      <Link
                        className="p-1.5 border-2 rounded-md  hover:bg-rose-600"
                        href={`/lists/${list.id}`}
                      >
                        Open
                      </Link>

                      <button
                        className=" mt-4 mb-3 mx-3 px-1 border-2 rounded-md  hover:bg-amber-400"
                        onClick={() => updateListHandler(list)}
                      >
                        {updateListMutation.isLoading &&
                        updateListId === list.id ? (
                          <LoadingSpinnerButton />
                        ) : (
                          "Update"
                        )}
                      </button>

                      <button
                        className=" px-2 border-2 rounded-md  hover:bg-rose-600"
                        onClick={() => deleteListHandler(list.id)}
                      >
                        {deleteListMutation.isLoading &&
                        deletingListId == list.id ? (
                          <LoadingSpinnerButton />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
              {editList && editList.id === list.id ? ( // if "editList" is null it will no be visible"
                <form className="mt-5">
                  <input
                    className="w-80 p-2 font-bold text-slate-800 rounded-md border-2"
                    type="text"
                    value={editList.name}
                    onChange={(event) =>
                      setEditList({ ...editList, name: event.target.value })
                    }
                  />
                  <button
                    className="ml-5 mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                    onClick={() => updateListItem(editList.id, editList.name)}
                  >
                    Update
                  </button>
                  <button
                    className="ml-2 mr-1 px-1 border-2 rounded-md  hover:bg-slate-500"
                    onClick={() => setEditList(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : null}
            </li>
          </div>
        ))}
      </ul>
    </section>
  );
}

export default AllLists;
