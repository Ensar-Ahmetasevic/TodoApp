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
          <li className="mb-3" key={list.id} style={{ listStyle: "none" }}>
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

            <Link className="" href={`/lists/${list.id}`}>
              Open
            </Link>

            {list.checkBox ? (
              <button
                className="ml-2 px-2 border-2 rounded-md  hover:bg-rose-600"
                onClick={() => deleteListHandler(list.id)}
              >
                {deleteListMutation.isLoading && deletingListId === list.id ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Delete"
                )}
              </button>
            ) : (
              <>
                <button
                  className="ml-5 mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                  onClick={() => updateListHandler(list)}
                >
                  {updateListMutation.isLoading && updateListId === list.id ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  className="ml-2 px-2 border-2 rounded-md  hover:bg-rose-600"
                  onClick={() => deleteListHandler(list.id)}
                >
                  {deleteListMutation.isLoading && deletingListId == list.id ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Delete"
                  )}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
      {editList ? ( // if "editList" is null it will no be visible"
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
    </section>
  );
}

export default AllLists;
