import { useState } from "react";
import { useForm } from "react-hook-form";

import { getSession } from "next-auth/client";
import { useTodoItems } from "@/helpers/useApi";

function HomePage() {
  //
  const {
    isLoading,
    isError,
    error,
    data,
    addTodoMutation,
    updateTodoMutation,
    toggleCheckBoxMutation,
    deleteTodoMutation,
  } = useTodoItems();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [editTodo, setEditTodo] = useState(null);
  const [checkBox, setCheckBox] = useState(false);

  function sendTextItemHandler(data) {
    // When the form is submitted, the "handleSubmit" function will automatically prevent the default form submission behavior
    // So we don't need to call "event.preventDefault()" when using the React Hook Form.
    const enteredTodo = data.todoInput;

    addTodoMutation.mutate({ text: enteredTodo, checkBox: false });
    reset(); // Reset the form after submission
  }

  function updateItemHandler(item) {
    setEditTodo(item);
  }

  function updateTodoItem(id, text) {
    updateTodoMutation.mutate({ id, text });
    setEditTodo(null);
  }

  function toggleCheckBoxHandler(id, checkBox) {
    toggleCheckBoxMutation.mutate({ id, checkBox: !checkBox });
  }

  function deleteItemHandler(id) {
    deleteTodoMutation.mutate(id);
  }

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <section>
      <h2 className="p-3  text-xl font-bold">Please enter your ToDo`s</h2>
      <form
        className="max-w-md mx-auto"
        onSubmit={handleSubmit(sendTextItemHandler)}
      >
        <div className="mb-6 flex">
          <input
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
            type="text"
            placeholder="Enter a new todo item"
            maxLength={1000}
            {...register("todoInput", { required: true })}
          />
          <button className="ml-4 px-2 border-2 rounded-md hover:bg-sky-700">
            Add
          </button>
        </div>
        <div className="mt-2 italic text-gray-300 text-sm">
          {errors.todoInput && <p> This field is required </p>}
        </div>
      </form>

      <ul>
        {data.allItems
          .filter((item) => item.checkBox === false)
          .map((item) => (
            <li className="mb-3" key={item.id} style={{ listStyle: "none" }}>
              <input
                className="mr-1 mb-2"
                type="checkbox"
                id={item.id}
                name={item.id}
                onChange={() => {
                  toggleCheckBoxHandler(item.id, item.checkBox);
                }}
              />
              <label className="mx-1 text-xl" htmlFor={item.id}>
                {item.text}
              </label>

              <button
                className="ml-5 mr-1 px-1 border-2 rounded-md  hover:bg-amber-400"
                onClick={() => updateItemHandler(item)}
              >
                Update
              </button>
              <button
                className="ml-2 px-2 border-2 rounded-md  hover:bg-rose-600"
                onClick={() => deleteItemHandler(item.id)}
              >
                Delete
              </button>
            </li>
          ))}

        {data.allItems
          .filter((item) => item.checkBox === true)
          .map((item) => (
            <li key={item.id} style={{ listStyle: "none" }}>
              <input
                className="mr-1 mb-2"
                type="checkbox"
                id={item.id}
                name={item.id}
                onChange={() => {
                  toggleCheckBoxHandler(item.id, item.checkBox);
                }}
              />
              <label htmlFor={item.id} className={"checked mx-1 text-xl"}>
                {item.text}
              </label>

              <button
                className="ml-2 px-2 border-2 rounded-md  hover:bg-rose-600"
                onClick={() => deleteItemHandler(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>

      {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
      {editTodo ? ( // if "editTodo is null  it will no be visible"
        <form className="mt-5">
          <input
            className="px-10 py-1 font-bold text-slate-800 rounded-md border-2"
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
    </section>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default HomePage;
