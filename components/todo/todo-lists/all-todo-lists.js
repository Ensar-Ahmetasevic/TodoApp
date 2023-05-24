import { sortBy } from "lodash";

import TodoListQuery from "@/requests/requests-for-todo-lists/todo-list-query";
import SingleTodoList from "./todo-list-components/single-todo-list";

function AllTodoLists() {
  const { data: listsData } = TodoListQuery();

  return (
    <section className="grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className="col-start-2 col-span-4 sm:col-start-1 sm:col-span-7">
        <ul>
          {sortBy(listsData?.allLists, ["isComplete"]).map((list) => (
            <SingleTodoList key={list.id} list={list} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AllTodoLists;
