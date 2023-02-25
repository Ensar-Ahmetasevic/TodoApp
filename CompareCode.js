import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

function HomePage() {
  const todoInputRef = useRef();
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery(
    "todoItems",
    async () => {
      const res = await fetch("/api/items");
      return res.json();
    }
  );

  const addTodoMutation = useMutation(
    (newTodo) =>
      fetch("/api/items", {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  const updateTodoMutation = useMutation(
    (updatedTodo) =>
      fetch("/api/items", {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  const toggleCheckBoxMutation = useMutation(
    (updatedTodo) =>
      fetch("/api/items", {
        method: "PATCH",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  const deleteTodoMutation = useMutation(
    (id) =>
      fetch("/api/items", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  const [editTodo, setEditTodo] = useState(null);

  function sendTextItemHandler(event) {
    event.preventDefault();
    const enteredTodo = todoInputRef.current.value;

    addTodoMutation.mutate({ text: enteredTodo, checkBox: false });
    todoInputRef.current.value = "";
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
      <h2>Please enter your ToDos</h2>
      <form onSubmit={sendTextItemHandler}>
        <div>
          <input
            maxLength={1000}
            type="text"
            placeholder="Enter a new todo item"
            ref={todoInputRef}
          />
          <button>Add</button>
        </div>
      </form>

      <ul>
        {data.allItems
          .filter((item) => item.checkBox === false)
          .map((item) => (
            <li key={item.id} style={{ listStyle: "none" }}>
              <input
                type="checkbox"
                id={item.id}
                name={item.id}
                onChange={() => {
                  toggleCheckBoxHandler(item.id, item.checkBox);
                }}
              />
              <label htmlFor={item.id}>{item.text}</label>

              <button onClick={() => updateItemHandler(item)}>Update</button>
              <button onClick={() => deleteItemHandler(item.id)}>Delete</button>
            </li>
          ))}

        {data.allItems
          .filter((item) => item.checkBox === true)
          .map((item) => (
            <li key={item.id} style={{ listStyle: "none" }}>
              <input
                type="checkbox"
                id={item.id}
                name={item.id}
                onChange={() => {
                  toggleCheckBoxHandler(item.id, item.checkBox);
                }}
              />
              <label htmlFor={item.id} className={"checked"}>
                {item.text}
              </label>

              <button onClick={() => deleteItemHandler(item.id)}>Delete</button>
            </li>
          ))}
      </ul>

      {/* Add an input field for editing the todo item and make it visible only when an item is being edited.*/}
      {editTodo ? ( // if "editTodo is null  it will no be visible"
        <form>
          <input
            type="text"
            value={editTodo.text}
            onChange={(event) =>
              setEditTodo({ ...editTodo, text: event.target.value })
            }
          />
          <button onClick={() => updateTodoItem(editTodo.id, editTodo.text)}>
            Update
          </button>
          <button onClick={() => setEditTodo(null)}>Cancel</button>
        </form>
      ) : null}
    </section>
  );
}

export default HomePage;
