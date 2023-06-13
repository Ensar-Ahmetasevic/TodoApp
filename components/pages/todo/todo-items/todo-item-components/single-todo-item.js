import { useState } from "react";
import { useS3Upload } from "next-s3-upload";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import LoadingSpinner from "@/components/shared/loading-spiner";
import LoadingSpinnerButton from "@/components/shared/loading-spiner-button";

import useDeleteTodoItemMutation from "@/requests/requests-for-todo-items/use-delete-todo-item-mutation";
import useIsCompletedTodoItemMutation from "@/requests/requests-for-todo-items/use-isCompleted-todo-item-mutation";
import useUpdateTodoItemMutation from "@/requests/requests-for-todo-items/use-update-todo-item-mutation";
import useCreateAwsUrlMutation from "@/requests/requests-for-aws-url/use-create-aws-url-mutation";
import useDeleteAwsUrlMutation from "@/requests/requests-for-aws-url/use-delete-aws-url-mutation";
import useAwsUrlQuery from "@/requests/requests-for-aws-url/use-url-react-query";

function SingleTodoItem({ item }) {
  //
  const [toggleUpdateButttom, setToggleUpdateButttom] = useState(null);
  const [toggleAddFileButttom, setToggleAddFileButttom] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [imageUrl, setImageUrl] = useState();
  const { uploadToS3 } = useS3Upload();

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (next) => setSlideIndex(next),
  };

  const { data: URLdata } = useAwsUrlQuery(item.id);

  const deleteAwsUrlMutation = useDeleteAwsUrlMutation();
  const createAwsUrlMutation = useCreateAwsUrlMutation();
  const deleteTodoItemMutation = useDeleteTodoItemMutation();
  const isCompletedTodoItemMutation = useIsCompletedTodoItemMutation();
  const updateTodoItemMutation = useUpdateTodoItemMutation();

  // TODO ITEM MUTATIOS:

  function updateItemHandler(data) {
    // data from react-hook-form
    const text = data.text;
    const id = item.id;

    if (!/.*\S+.*/.test(text)) {
      //hecks if the input "name" contains at empty space
      reset();
      return;
    }

    updateTodoItemMutation.mutateAsync({ id, text });
    setToggleUpdateButttom(null);
  }

  function toggleisCompleteHandler(id, isComplete) {
    isCompletedTodoItemMutation.mutateAsync({ id, isComplete: !isComplete });
    setToggleAddFileButttom(true);
    setToggleUpdateButttom(null);
  }

  function deleteItemHandler(id) {
    deleteTodoItemMutation.mutateAsync(id);

    setToggleAddFileButttom(true);
  }

  // AWS URL MUTATIOS:

  async function deleteURLHandler(URLid) {
    await deleteAwsUrlMutation.mutateAsync(URLid);
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
      await createAwsUrlMutation.mutateAsync({ url, todoID });

      // Clear the selected file
      setSelectedFile(null);

      // Clear the input file field
      const fileInput = document.querySelector('input[name="file"]');
      fileInput.value = null;
    }
  }

  return (
    <li
      className={`my-10 py-5 lg:p-0 rounded-lg border-4 border-solid hover:pulse hover:bg-gray-800 
      ${
        item.isComplete === false
          ? " border-green-600 hover:border-green-400"
          : " border-red-600 hover:border-red-400"
      } `}
    >
      <div className="grid grid-cols-3 gap-4">
        {""}
        <div className="col-span-2 ml-10 lg:col-span-3 lg:mx-3 lg:mt-3">
          <div className="flex justify-start">
            <div>
              <input
                className="w-4 h-4 mt-2 mr-1 peer cursor-pointerlg:h-3 lg:w-3 accent-red-500"
                type="checkbox"
                id={item.id}
                name={item.id}
                checked={item.isComplete}
                // enables the isComplete to remember the value (true or false), i.e. if it is "true", it will remember
                // and keep that little check mark
                onChange={() => {
                  toggleisCompleteHandler(item.id, item.isComplete);
                }}
              />
            </div>

            <label
              className={`mx-1 text-xl text-left lg:text-lg ${
                item.isComplete ? "line-through text-slate-400" : ""
              }`}
              style={{ whiteSpace: "pre-wrap" }}
              htmlFor={item.id}
            >
              {isCompletedTodoItemMutation.isLoading ? (
                <>
                  <LoadingSpinner />
                  {item.text}
                </>
              ) : (
                item.text
              )}
            </label>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <div className="py-2 mt-10 mr-3 sm:mr-0 border-2 border-gray-500 border-solid rounded-lg hover:border-gray-100 lg:border-0  lg:ml-0 lg:mt-0">
            {item.isComplete ? (
              <button
                className="px-2 my-2 border-2 rounded-md hover:bg-rose-600"
                onClick={() => deleteItemHandler(item.id)}
              >
                {deleteTodoItemMutation.isLoading ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Delete"
                )}
              </button>
            ) : (
              <>
                <button
                  className="px-1 border-2 rounded-md hover:bg-amber-400"
                  onClick={() => setToggleUpdateButttom(item)}
                >
                  {updateTodoItemMutation.isLoading ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Update"
                  )}
                </button>

                <button
                  className="px-2 mx-2 my-2 border-2 rounded-md hover:bg-rose-600"
                  onClick={() => deleteItemHandler(item.id)}
                >
                  {deleteTodoItemMutation.isLoading ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Delete"
                  )}
                </button>

                <button
                  className={` px-2 border-2 rounded-md ${
                    toggleAddFileButttom
                      ? "hover:bg-green-600"
                      : "hover:bg-slate-500"
                  }`}
                  onClick={() => setToggleAddFileButttom(!toggleAddFileButttom)}
                >
                  {toggleAddFileButttom
                    ? !URLdata?.url?.length
                      ? "Add File"
                      : "Show Files"
                    : "Close"}
                </button>

                {!toggleAddFileButttom && (
                  <div className="ml-2 lg:ml-0 ">
                    <div className="lg:ml-5">
                      <input
                        className="block w-full mt-5 text-sm text-slate-300 file:mr-2 file:py-2 file:px-2 file:rounded-full file:border-2 file:text-sm file:font-semibold file:bg-blue-50 file:text-black-700 hover:file:bg-blue-200"
                        type="file"
                        name="file"
                        onChange={(e) => handleFilesChange(e)}
                      />
                    </div>

                    <br />
                    <div>
                      <button
                        className="px-2 border-2 rounded-md hover:bg-sky-700"
                        onClick={() => saveFilesChange(item.id)}
                      >
                        {createAwsUrlMutation.isLoading ? (
                          <LoadingSpinnerButton />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="col-span-3 col-end-9 ">
              <>
                {!toggleAddFileButttom && URLdata?.url?.length ? (
                  // if toggleAddFileButttom === false and if the URL array is not empty
                  <div className="mt-10">
                    <h2>{`Number of files: ${URLdata.url.length}`}</h2>
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
                        <div className="w-1/4 p-4 h-1/4" key={file.id}>
                          <div className="flex items-center justify-center w-full h-full">
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
                              className="px-1 mr-2 border-2 rounded-md hover:bg-green-600"
                              onClick={() => router.push(`${file.url}`)}
                            >
                              Open
                            </button>

                            <button
                              className="px-1 border-2 rounded-md hover:bg-rose-600"
                              onClick={() => deleteURLHandler(file.id)}
                            >
                              {deleteAwsUrlMutation.isLoading ? (
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

        {toggleUpdateButttom ? ( // if "toggleUpdateButttom" is true it will no be visible"
          <section className="grid items-center grid-cols-4 gap-2 lg:mb-3">
            <div className="col-span-2 col-start-2 lg:col-start-1 lg:col-span-6 lg:mx-4 lg:text-sm">
              <form
                className="max-w-md mx-auto mt-5 "
                onSubmit={handleSubmit(updateItemHandler)}
              >
                <div className="lg:flex">
                  <textarea
                    className="w-full px-3 py-3 bg-transparent border border-l-4 border-r-4 border-gray-500 rounded-md text-slate-100 lg:text-sm focus:ring-1 focus:r-ring-gray-500 focus:outline-none"
                    style={{
                      maxHeight: "200px",
                      height: "120px",
                      overflow: "auto",
                    }}
                    defaultValue={item.text}
                    {...register("text")}
                    // "defaultValu" + "new entered text" using the registered field named "name" we can access that value
                  />
                </div>

                <div className="flex justify-center mt-5 ">
                  <button
                    className="px-1 mr-1 border-2 rounded-md hover:bg-amber-400"
                    type="submit"
                  >
                    Update
                  </button>
                  <button
                    className="px-1 ml-2 border-2 rounded-md hover:bg-slate-500"
                    onClick={() => {
                      setToggleUpdateButttom(null);
                      reset();
                    }}
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
  );
}

export default SingleTodoItem;
