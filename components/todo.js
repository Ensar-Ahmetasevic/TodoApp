import { useState } from "react";

function ToDo() {
  const [itemsList, setItemsList] = useState(LOADING_ITEMS);
  const [addItem, setAddItem] = useState("");

  const handleAdd = () => {
    // if we have some text in input code will execute (true) -> so the "addItem === true and codde" will execute,
    // if the input is "" or 0 the Boolean is false and code will not execute
    //
    if (addItem) {
      // if addItem is true then ...
      setItemsList([
        {
          id: uuidv4(),
          message: addItem,
          done: false,
        },
        ...itemsList,
      ]);

      setAddItem("");
    }
  };

  const handlerEnter = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="w-3/4 mx-auto text-center">
      <h1 className="text-5xl pb-8 pt-4">Pleas enter your ToDo's</h1>
      <form>
        <div className="pb-8">
          <input
            className="text-gray-900 px-4 py-2 rounded "
            value={addItem}
            onChange={(e) => setAddItem(e.target.value)}
            type="text"
            maxLength={1000}
            required
            placeholder="Enter a new todo item"
            size={50}
            onKeyDown={handlerEnter}
          />
          <button
            className="mx-6 px-2 rounded border-2 border-weis-600 hover:border-gray-400"
            type="button"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </form>

      <div>
        <ul>
          {itemsList
            // .filter((item) => !item.done) // if the value done =  false
            .map((item) => (
              <li key={item.id}>
                {item.message}
                <button
                  className="mx-5 px-2 rounded border-2 border-weis-600 hover:border-gray-400"
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="px-2 rounded border-2 border-weis-600 hover:border-gray-400"
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDo;
