import { useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";

import { TodoMutations } from "./todo-react-query/todo-mutations";
import LoadingSpinner from "@/helpers/loading-spiner";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import ErrorNotification from "@/helpers/error";
import { URLMutations } from "../todo-aws-url/url-mutations";
import { useS3Upload } from "next-s3-upload";
import AwsUrlQuery from "../todo-aws-url/url-react-query";

function TodoForm() {
  const [editTodo, setEditTodo] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updateItemId, setUpdateItemId] = useState(null);
  const [addFile, setAddFile] = useState(true);
  const [URLitemID, setURLItemID] = useState(null);
  let [imageUrl, setImageUrl] = useState();

  const { uploadToS3 } = useS3Upload();

  const { data: URLdata } = AwsUrlQuery(URLitemID);
  console.log("Ovo je:", URLdata);

  const {
    isLoading,
    isError,
    error,
    data,
    createTodoMutation,
    updateTodoMutation,
    toggleCheckBoxMutation,
    deleteTodoMutation,
  } = TodoMutations();

  const { createURLMutation } = URLMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function sendTextItemHandler(data) {
    //"data" from react-hook-form
    const enteredTodo = data.todoInput;

    createTodoMutation.mutateAsync({ text: enteredTodo, checkBox: false });
    reset(); // Reset the form after submission
  }

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

  function addFileHandler(itemID) {
    setURLItemID(itemID);
    setAddFile(!addFile);
  }

  const handleFilesChange = async (e, todoID) => {
    let file = e.target.files[0];
    let { url } = await uploadToS3(file);

    createURLMutation.mutateAsync({ url, todoID });
    setImageUrl(url);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section>
      <h2 className=" text-xl font-bold">Please enter your ToDo`s</h2>
      <form
        className="max-w-md mx-auto"
        onSubmit={handleSubmit(sendTextItemHandler)}
      >
        <div className=" mt-2 mb-6 flex">
          <input
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
            type="text"
            placeholder="Enter a new todo item"
            maxLength={1000}
            {...register("todoInput", { required: true })}
          />
          <button
            className="ml-4 p-2 border-2 rounded-md hover:bg-sky-700"
            type="submit"
            disabled={createTodoMutation.isLoading}
          >
            {createTodoMutation.isLoading ? <LoadingSpinnerButton /> : "Add"}
          </button>
        </div>
        <div className="mt-2 italic text-gray-300 text-sm">
          {errors.todoInput && <p> This field is required </p>}
        </div>
      </form>

      <ul>
        {_.sortBy(data.allItems, ["checkBox"]).map((item) => (
          // first sort "items" wher "checkBox" value is "true" and then whit value "false"
          <li className="mb-3" key={item.id} style={{ listStyle: "none" }}>
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

            {item.checkBox ? (
              <button
                className="ml-2 px-2 border-2 rounded-md  hover:bg-rose-600"
                onClick={() => deleteItemHandler(item.id)}
              >
                {deleteTodoMutation.isLoading && deletingItemId === item.id ? (
                  <LoadingSpinnerButton />
                ) : (
                  "Delete"
                )}
              </button>
            ) : (
              <>
                <button
                  className="ml-5 mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                  onClick={() => updateItemHandler(item)}
                >
                  {updateTodoMutation.isLoading && updateItemId === item.id ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  className="ml-2 px-2 border-2 rounded-md  hover:bg-rose-600"
                  onClick={() => deleteItemHandler(item.id)}
                >
                  {deleteTodoMutation.isLoading && deletingItemId == item.id ? (
                    <LoadingSpinnerButton />
                  ) : (
                    "Delete"
                  )}
                </button>

                {addFile && (
                  <button
                    className="ml-2 px-2 border-2 rounded-md hover:bg-green-600"
                    onClick={() => addFileHandler(item.id)}
                  >
                    Add File
                  </button>
                )}

                {!addFile && URLitemID === item.id && (
                  <div className="ml-2">
                    <button
                      className="px-2 border-2 rounded-md hover:bg-slate-500"
                      onClick={() => setAddFile(true)}
                    >
                      Cancel
                    </button>
                    <input
                      className=" ml-5"
                      type="file"
                      name="file"
                      onChange={(e) => handleFilesChange(e, item.id)}
                    />
                    <div>
                      <h1>file</h1>
                    </div>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
      {editTodo ? ( // if "editTodo" is null it will no be visible"
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

      {!addFile ? <div>{imageUrl && <img src={imageUrl.url} />}</div> : false}
    </section>
  );
}

export default TodoForm;
