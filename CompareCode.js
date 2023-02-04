import { useRef } from "react";
import React, { useState, useEffect } from "react";

function HomePage() {
  const [todoItems, setTodoItems] = useState([]);

  const todoInputRef = useRef();

  // sending entered text from the input field to DB
  function send_Text_Item_Handler(event) {
    event.preventDefault();
    const enteredTodo = todoInputRef.current.value; // extracting the entered text from the input field

    fetch("/api/api_items", {
      method: "POST",
      body: JSON.stringify({ text: enteredTodo }), // sending a JSON data
      headers: { "Content-Type": "application/json" }, // Indicates that the request body format is JSON.
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  // function to delete a todo item
  function deleteItemHandler(itemId) {
    fetch("/api/api_items", {
      method: "DELETE",
      body: JSON.stringify({ id: itemId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  // displaying all items
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

  // function to edit/update a todo item

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
      <ul>
        {todoItems.map((item) => (
          <li key={item._id}>
            <input type="checkbox" id={item._id} name={item._id} value="Bike" />
            <label htmlFor={item._id}>{item.text}</label>
            <button>Update</button>
            <button onClick={() => deleteItemHandler(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomePage;
