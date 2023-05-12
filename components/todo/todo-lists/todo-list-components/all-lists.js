import { useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import moment from "moment";

import { ListMutations } from "../list-react-query/list-mutations";
import LoadingSpinner from "@/helpers/loading-spiner";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import ErrorNotification from "@/helpers/error";

function AllLists() {
  const [editList, setEditList] = useState(null);
  const [deletingListId, setDeletingListId] = useState(null);
  const [updateListId, setUpdateListId] = useState(null);

  const router = useRouter();

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
    setEditList(null);
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
        {_.sortBy(data.allLists, ["checkBox"]).map((list) => (
          <div
            className={`col-start-2 col-span-4 rounded-lg mt-3 mb-3 border-4 border-solid hover:bg-gray-800  ${
              list.checkBox === false
                ? " border-green-600 hover:border-green-400"
                : " border-red-600 hover:border-red-400"
            } `}
          >
            <li className="my-3" key={list.id} style={{ listStyle: "none" }}>
              <div className="grid grid-cols-8 gap-2">
                {/*  */}
                <div className="col-start-1 col-end-6 mx-5 sm:col-start-1 sm:col-span-5 sm:ml-5 sm:mr-0 ">
                  <input
                    className="mr-3 mb-2 sm:h-3 sm:w-3 cursor-pointer accent-red-500"
                    type="checkbox"
                    id={list.id}
                    name={list.id}
                    checked={list.checkBox} // enables the checkbox to remember the value (true or false), i.e. if it is "true", it will remember and keep that little check mark
                    onChange={() => {
                      toggleCheckBoxHandler(list.id, list.checkBox);
                    }}
                  />
                  <label
                    className={`mx-1 text-xl sm:text-lg  ${
                      list.checkBox ? "checked" : ""
                    }`}
                    htmlFor={list.checkBox.toString()}
                    //If we want to write the htmlFor attribute to the DOM with a boolean value, we need to convert it to a string
                  >
                    {toggleCheckBoxMutation.isLoading ? (
                      <>
                        <LoadingSpinner />
                        {list.name}
                      </>
                    ) : (
                      list.name
                    )}
                  </label>
                </div>

                <div className="col-end-9 col-span-2 sm:text-xs  sm:col-span-3 sm:mr-2">
                  <p className="text-left sm:text-right">
                    <b>Created:</b> <br />
                    {moment(list.createdAt).format("DD/MM/YYYY")}
                  </p>
                  {moment(list.createdAt).isSame(list.updatedAt, "day") ? (
                    ""
                  ) : (
                    <p className="text-left mt-1 sm:text-right">
                      <b>Last update:</b> <br />
                      {moment(list.updatedAt).format("DD/MM/YYYY")}
                    </p>
                  )}
                </div>

                <div className=" col-end-9 col-span-3 sm:col-end-9 sm:col-span-2 sm:border-0 sm:mr-2 sm:ml-0 py-1 mx-2  border-2 border-solid border-gray-500 hover:border-gray-100 rounded-lg ">
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
                        <button
                          className="p-1.5 border-2 rounded-md  hover:bg-green-600 md:ml-2 sm:px-1 sm:p-0"
                          onClick={() => router.push(`/lists/${list.id}`)}
                        >
                          {isLoading ? <LoadingSpinnerButton /> : "Open"}
                        </button>

                        <button
                          className=" mt-3 mb-3 mx-3 px-1 border-2 rounded-md  hover:bg-amber-400 sm:mx-0 sm:mt-2 sm:mb-2"
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
              </div>

              {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
              {editList && editList.id === list.id ? ( // if "editList" is null it will no be visible"
                <section className="grid grid-cols-6 gap-4">
                  <div className="col-start-2 col-span-4 sm:col-start-1 sm:col-span-6 sm:mx-4 ">
                    <form className="mt-5  max-w-md mx-auto">
                      <div className="flex">
                        <input
                          className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full sm:text-sm"
                          type="text"
                          value={editList.name}
                          onChange={(event) =>
                            setEditList({
                              ...editList,
                              name: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mt-5">
                        <button
                          className=" mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                          onClick={() =>
                            updateListItem(editList.id, editList.name)
                          }
                        >
                          Update
                        </button>
                        <button
                          className="ml-1 px-1 border-2 rounded-md  hover:bg-slate-500"
                          onClick={() => setEditList(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              ) : null}
            </li>
          </div>
        ))}
      </ul>
    </section>
  );
}

export default AllLists;
