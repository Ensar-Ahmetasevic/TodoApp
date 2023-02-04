import { useState, useEffect, useRef } from "react";

function HomePage() {
  const [todoItems, setTodoItems] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [checkBox, setCheckBox] = useState(false);

  const todoInputRef = useRef();

  // sending entered text from the input field to DB
  function send_Text_Item_Handler(event) {
    event.preventDefault();
    const enteredTodo = todoInputRef.current.value; // extracting the entered text from the input field

    fetch("/api/api_items", {
      method: "POST",
      body: JSON.stringify({ text: enteredTodo, checkBox: checkBox }), // sending a JSON data
      headers: { "Content-Type": "application/json" }, // Indicates that the request body format is JSON.
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(window.location.reload());
  }

  // fetching all data
  useEffect(() => {
    fetch("/api/api_items")
      .then((response) => response.json())
      .then((data) => {
        setTodoItems(data.allItems);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // function to delete a todo item
  function deleteItemHandler(itemId) {
    fetch("/api/api_items", {
      method: "DELETE",
      body: JSON.stringify({ id: itemId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(window.location.reload());
  }

  // function to edit/update a todo item

  function updateItemHandler(item) {
    setEditTodo(item);
  }

  function updateTodoItem(id, text) {
    fetch("/api/api_items", {
      method: "PUT",
      body: JSON.stringify({ id: id, text: text }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setEditTodo(null);
        console.log(data);
      });
  }

  // function to toggle the checkBox state
  function toggleCheckBoxHandler(itemId, itemCheckBox) {
    fetch("/api/api_items", {
      method: "PATCH",
      body: JSON.stringify({ id: itemId, checkBox: !itemCheckBox }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .then(window.location.reload());
  }

  return (
    <section>
      <h2>Pleas enter your ToDo's</h2>
      <form onSubmit={send_Text_Item_Handler}>
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
      {""}
      {""}
      <ul>
        {todoItems
          .filter((item) => item.checkBox === false)
          .map((item) => (
            <li key={item._id} style={{ listStyle: "none" }}>
              <input
                type="checkbox"
                id={item._id}
                name={item._id}
                onChange={() => {
                  toggleCheckBoxHandler(item._id, item.checkBox);
                }}
              />
              <label htmlFor={item._id}>{item.text}</label>

              <button onClick={() => updateItemHandler(item)}>Update</button>
              <button onClick={() => deleteItemHandler(item._id)}>
                Delete
              </button>
            </li>
          ))}

        {todoItems
          .filter((item) => item.checkBox === true)
          .map((item) => (
            <li key={item._id} style={{ listStyle: "none" }}>
              <input
                type="checkbox"
                id={item._id}
                name={item._id}
                onChange={() => {
                  toggleCheckBoxHandler(item._id, item.checkBox);
                }}
              />
              <label htmlFor={item._id} className={"checked"}>
                {item.text}
              </label>

              <button onClick={() => deleteItemHandler(item._id)}>
                Delete
              </button>
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
          <button onClick={() => updateTodoItem(editTodo._id, editTodo.text)}>
            Update
          </button>
          <button onClick={() => setEditTodo(null)}>Cancel</button>
        </form>
      ) : null}
    </section>
  );
}

export default HomePage;
