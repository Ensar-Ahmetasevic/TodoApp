import { useState } from "react";
import { useS3Upload } from "next-s3-upload";
import Image from "next/image";
import { useRouter } from "next/router";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useDeleteTodoItemMutation from "@/requests/requests-for-todo-items/use-delete-todo-item-mutation";

import TodoItemMutations from "../../../../requests/requests-for-todo-items/todo-items-mutations";
import AwsUrlQuery from "../../../../requests/requests-for-aws-url/url-react-query";
import AwsUrlMutations from "../../../../requests/requests-for-aws-url/url-mutations";
import LoadingSpinner from "@/helpers/loading-spiner";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";

function SingleTodoItem({ item }) {
  //
  const [editTodo, setEditTodo] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updateItemId, setUpdateItemId] = useState(null);
  const [addFileItemID, setAddFileItemID] = useState(null);
  const [showFile, setShowFile] = useState(false);
  const [addFile, setAddFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [slideIndex, setSlideIndex] = useState(0);

  const router = useRouter();

  const [imageUrl, setImageUrl] = useState();
  const { uploadToS3 } = useS3Upload();

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setSlideIndex(next),
  };

  const { data: URLdata } = AwsUrlQuery(addFileItemID);
  const { createURLMutation, deleteURLMutation } = AwsUrlMutations();
  const { updateTodoMutation, toggleisCompleteMutation, deleteTodoMutation } =
    TodoItemMutations();

  const { mutateAsync: deleteTodoItemMutation } = useDeleteTodoItemMutation();

  // TODO ITEM MUTATIOS:

  function updateItemHandler(item) {
    setEditTodo(item);
  }

  function updateTodoItem(id, text) {
    setUpdateItemId(id);
    updateTodoMutation.mutateAsync({ id, text });
    setEditTodo(null);
  }

  function toggleisCompleteHandler(id, isComplete) {
    toggleisCompleteMutation.mutateAsync({ id, isComplete: !isComplete });
    setAddFile(true);
    setShowFile(false);
    setEditTodo(null);
  }

  function deleteItemHandler(id) {
    setDeletingItemId(id);
    deleteTodoItemMutation(id);
    setAddFile(true);
    setShowFile(false);
  }

  // AWS URL MUTATIOS:

  function addFileHandler(itemID) {
    setAddFileItemID(itemID);
    setAddFile(!addFile);
    setShowFile(false);
  }

  async function deleteURLHandler(URLid) {
    await deleteURLMutation.mutateAsync(URLid);
  }

  const handleFilesChange = async (e) => {
    let file = e.target.files[0];
    let { url } = await uploadToS3(file);
    setImageUrl(url);

    // Set the selected file
    setSelectedFile(file);
  };

  async function saveFilesChange(todoID) {
    const url = imageUrl;

    // Check if a file was selected
    if (selectedFile !== null) {
      await createURLMutation.mutateAsync({ url, todoID });

      // Clear the selected file
      setSelectedFile(null);

      // Clear the input file field
      const fileInput = document.querySelector('input[name="file"]');
      fileInput.value = null;
    }
  }

  function showFiles() {
    setShowFile(!showFile);
  }

  return (
    <div
      className={`mt-3 mb-3 sm:p-0 rounded-lg border-4 border-solid hover:pulse hover:bg-gray-800 ${
        item.isComplete === false
          ? " border-green-600 hover:border-green-400"
          : " border-red-600 hover:border-red-400"
      } `}
    >
      <li className="my-3" style={{ listStyle: "none" }}>
        <div className="grid grid-cols-3 gap-4">
          {""}
          <div className="col-span-2 mx-16 sm:col-span-3 sm:ml-3 sm:mr-3">
            <div className="flex justify-start">
              <div>
                <input
                  className="mr-1 mt-2 h-4 w-4 sm:h-3 sm:w-3 cursor-pointer accent-red-500"
                  type="checkbox"
                  id={item.id}
                  name={item.id}
                  checked={item.isComplete} // enables the isComplete to remember the value (true or false), i.e. if it is "true", it will remember and keep that little check mark
                  onChange={() => {
                    toggleisCompleteHandler(item.id, item.isComplete);
                  }}
                />
              </div>

              <div
                className={`text-left  mx-1 text-xl sm:text-lg ${
                  item.isComplete ? "checked" : ""
                }`}
                style={{ whiteSpace: "pre-wrap" }} //preserve the formatting and spacing
              >
                {toggleisCompleteMutation.isLoading ? (
                  <>
                    <LoadingSpinner />
                    {item.text}
                  </>
                ) : (
                  item.text
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <div className="py-2 mr-3 mt-10 border-2 border-solid border-gray-500 hover:border-gray-100 rounded-lg sm:border-0 sm:mr-2 sm:ml-0 sm:mt-0">
              {item.isComplete ? (
                <button
                  className=" my-2 px-2 border-2 rounded-md  hover:bg-rose-600 "
                  onClick={() => deleteItemHandler(item.id)}
                >
                  {deleteTodoMutation.isLoading &&
                  deletingItemId === item.id ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Delete"
                  )}
                </button>
              ) : (
                <>
                  <button
                    className=" px-1 border-2 rounded-md  hover:bg-amber-400"
                    onClick={() => updateItemHandler(item)}
                  >
                    {updateTodoMutation.isLoading &&
                    updateItemId === item.id ? (
                      <LoadingSpinnerButton />
                    ) : (
                      "Update"
                    )}
                  </button>
                  <button
                    className="mx-2 px-2 my-2 border-2 rounded-md  hover:bg-rose-600"
                    onClick={() => deleteItemHandler(item.id)}
                  >
                    {deleteTodoMutation.isLoading &&
                    deletingItemId == item.id ? (
                      <LoadingSpinnerButton />
                    ) : (
                      "Delete"
                    )}
                  </button>

                  <button
                    className={` px-2 border-2 rounded-md ${
                      addFile ? "hover:bg-green-600" : "hover:bg-slate-500"
                    }`}
                    onClick={() => addFileHandler(item.id)}
                  >
                    {addFile ? "Add File" : "Cancel"}
                  </button>

                  {!addFile && addFileItemID === item.id && (
                    <div className="ml-2 sm:ml-0 ">
                      <div className="sm:w-52">
                        <input
                          className=" my-5 sm:w-full sm:ml-2 sm:mt-6 sm:my-3"
                          type="file"
                          name="file"
                          onChange={(e) => handleFilesChange(e)}
                        />
                      </div>

                      <br />
                      <div>
                        <button
                          className="  px-2 border-2 rounded-md hover:bg-sky-700"
                          type="submit"
                          onClick={() => saveFilesChange(item.id)}
                        >
                          {createURLMutation.isLoading ? (
                            <LoadingSpinnerButton />
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>

                      <div>
                        <button
                          className={`ml-2 px-2 border-2 rounded-md sm:px-1 sm: mt-2 ${
                            !showFile
                              ? "hover:bg-green-600"
                              : "hover:bg-slate-500"
                          }`}
                          onClick={() => showFiles()}
                        >
                          {showFile ? "Hide My Files" : "Show My Files"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="col-end-9 col-span-3 ">
                <>
                  {showFile &&
                  URLdata?.url?.length &&
                  addFileItemID === item.id ? ( // if the ShowFile === false and if the URL array is not empty
                    <div className="mt-10">
                      <h2>{`Yor number of files: ${URLdata.url.length}`}</h2>
                      <p>Please scroll to the side</p>
                      <input
                        onChange={(e) => setSlideIndex(e.target.value)}
                        value={slideIndex}
                        type="range"
                        min={0}
                        max={URLdata.url.length - 1}
                        step={1}
                        className="w-1/6"
                      />
                      <Slider {...settings}>
                        {URLdata.url.map((file) => (
                          <div className="w-1/4 h-1/4 p-4" key={file.id}>
                            <div className="w-full h-full flex justify-center items-center">
                              <Image
                                className="rounded-md"
                                src={file.url}
                                alt={`${file.id}`}
                                width={300}
                                height={300}
                              />
                            </div>
                            <div className="mt-6">
                              <button
                                className="px-1 border-2 rounded-md hover:bg-green-600 mr-2"
                                onClick={() => router.push(`${file.url}`)}
                              >
                                Open
                              </button>

                              <button
                                className="px-1 border-2 rounded-md hover:bg-rose-600"
                                onClick={() => deleteURLHandler(file.id)}
                              >
                                {deleteURLMutation.isLoading ? (
                                  <LoadingSpinnerButton />
                                ) : (
                                  "Delete"
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : null}
                </>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}

          {editTodo && editTodo.id === item.id ? ( // if "editTodo" is null it will no be visible"
            <section className="grid grid-cols-4 gap-2 items-center">
              {" "}
              <div className="col-start-2 col-span-2 sm:col-start-1 sm:col-span-6 sm:mx-4 sm:text-sm">
                {" "}
                <form className=" mt-5 max-w-md mx-auto">
                  <div className="sm:flex">
                    <textarea
                      className="w-full  bg-transparent px-3 py-3 text-slate-100 rounded-md sm:text-sm  border border-r-4 border-l-4 border-gray-500 focus:ring-1 focus:r-ring-gray-500 focus:outline-none"
                      style={{
                        maxHeight: "200px",
                        height: "120px",
                      }}
                      value={editTodo.text}
                      onChange={(event) =>
                        setEditTodo({
                          ...editTodo,
                          text: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className=" flex justify-center mt-5">
                    <button
                      className=" mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                      onClick={() => updateTodoItem(editTodo.id, editTodo.text)}
                    >
                      Update
                    </button>
                    <button
                      className="ml-2 px-1 border-2 rounded-md  hover:bg-slate-500"
                      onClick={() => setEditTodo(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          ) : null}
        </div>
      </li>
    </div>
  );
}

export default SingleTodoItem;