import { useState } from "react";
import _ from "lodash";
import { useS3Upload } from "next-s3-upload";
import Image from "next/image";
import Link from "next/link";

import { TodoMutations } from "./todo-react-query/todo-mutations";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";
import { URLMutations } from "../todo-aws-url/url-mutations";
import AwsUrlQuery from "../todo-aws-url/url-react-query";

export default function AllItems() {
  const [editTodo, setEditTodo] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updateItemId, setUpdateItemId] = useState(null);
  const [addFileItemID, setAddFileItemID] = useState(null);
  const [showFile, setShowFile] = useState(false);
  const [addFile, setAddFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [slideIndex, setSlideIndex] = useState(0);

  const [imageUrl, setImageUrl] = useState();
  const { uploadToS3 } = useS3Upload();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setSlideIndex(next),
  };

  const { data: URLdata } = AwsUrlQuery(addFileItemID);

  const { createURLMutation, deleteURLMutation } = URLMutations();

  const {
    isLoading,
    isError,
    data,
    updateTodoMutation,
    toggleCheckBoxMutation,
    deleteTodoMutation,
  } = TodoMutations();

  function updateItemHandler(item) {
    setEditTodo(item);
  }
  function updateTodoItem(id, text) {
    setUpdateItemId(id);
    updateTodoMutation.mutateAsync({ id, text });
    setEditTodo(null);
  }

  function toggleCheckBoxHandler(id, checkBox) {
    toggleCheckBoxMutation.mutateAsync({ id, checkBox: !checkBox });
  }

  function deleteItemHandler(id) {
    setDeletingItemId(id);
    deleteTodoMutation.mutateAsync(id);
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

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section>
      <ul>
        {_.sortBy(data.allItems, ["checkBox"]).map((item) => (
          // first sort "items" wher "checkBox" value is "true" and then whit value "false"
          <div className="my-3 p-3 rounded-lg border-4 border-solid border-green-600 hover:border-green-400">
            <li key={item.id} style={{ listStyle: "none" }}>
              <div className="mb-3">
                <input
                  className="mr-1 mb-2"
                  type="checkbox"
                  id={item.id}
                  name={item.id}
                  checked={item.checkBox} // enables the checkbox to remember the value (true or false), i.e. if it is "true", it will remember and keep that little check mark
                  onChange={() => {
                    toggleCheckBoxHandler(item.id, item.checkBox);
                  }}
                />
                <label
                  className={`mx-1 text-xl ${item.checkBox ? "checked" : ""}`}
                  htmlFor={item.checkBox.toString()}
                  // If we want to write the htmlFor attribute to the DOM with a boolean value, we need to convert it to a string
                >
                  {item.text}
                </label>
              </div>

              <div className="  flex-row flex-initial w-1/3 py-2 mt-10 border-2 border-solid border-gray-500 hover:border-gray-100 rounded-lg sm:border-0">
                {item.checkBox ? (
                  <button
                    className=" my-2 px-2 border-2 rounded-md  hover:bg-rose-600"
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
                      className="mx-2 px-2 my-2 border-2 rounded-md  hover:bg-rose-600 sm:mx-0 "
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

                    <div>
                      {!addFile && addFileItemID === item.id && (
                        <div className="ml-2 ">
                          <input
                            className=" my-5"
                            type="file"
                            name="file"
                            onChange={(e) => handleFilesChange(e)}
                          />
                          <br />
                          <button
                            className="px-2 border-2 rounded-md hover:bg-sky-700"
                            type="submit"
                            onClick={() => saveFilesChange(item.id)}
                          >
                            Save
                          </button>
                          <button
                            className={`ml-2 px-2 border-2 rounded-md ${
                              !showFile
                                ? "hover:bg-green-600"
                                : "hover:bg-slate-500"
                            }`}
                            onClick={() => showFiles()}
                          >
                            {showFile ? "Hide My Files" : "Show My Files"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
              {editTodo && editTodo.id === item.id ? ( // if "editTodo" is null it will no be visible"
                <form className="mt-5">
                  <input
                    className="w-80 p-2 font-bold text-slate-800 rounded-md border-2"
                    type="text"
                    value={editTodo.text}
                    onChange={(event) =>
                      setEditTodo({ ...editTodo, text: event.target.value })
                    }
                  />
                  <button
                    className="ml-5 mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                    onClick={() => updateTodoItem(editTodo.id, editTodo.text)}
                  >
                    Update
                  </button>
                  <button
                    className="ml-2 mr-1 px-1 border-2 rounded-md  hover:bg-slate-500"
                    onClick={() => setEditTodo(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : null}
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
                        <div className="w-1/8 h-1/8 p-4" key={file.id}>
                          <div className="w-full h-full flex justify-center items-center">
                            <Image
                              src={file.url}
                              alt={`${file.id}`}
                              width={300}
                              height={300}
                              className="rounded-md"
                            />
                          </div>
                          <div className="mt-6">
                            <Link
                              className="px-1 border-2 rounded-md hover:bg-green-600 mr-2"
                              href={`${file.url}`}
                            >
                              Open
                            </Link>
                            <button
                              className="px-1 border-2 rounded-md hover:bg-rose-600"
                              onClick={() => deleteURLHandler(file.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : null}
              </>
            </li>
          </div>
        ))}
      </ul>
    </section>
  );
}
