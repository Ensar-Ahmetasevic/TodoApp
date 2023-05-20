import { sortBy } from "lodash";

import TodoSingleList from "./todo-list-components/todo-single-list";
import TodoListQuery from "@/requests/requests-for-todo-lists/todo-list-query";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";

function TodoAllLists() {
  const { data: listsData, isLoading, isError, error } = TodoListQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section className="grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className="col-start-2 col-span-4 sm:col-start-1 sm:col-span-7">
        <ul>
          {sortBy(listsData?.allLists, ["isComplete"]).map((list) => (
            <div
              key={list.id}
              className={`col-start-2 col-span-4 rounded-lg mt-3 mb-3 border-4 border-solid hover:bg-gray-800  ${
                list.isComplete === false
                  ? " border-green-600 hover:border-green-400"
                  : " border-red-600 hover:border-red-400"
              } `}
            >
              <TodoSingleList list={list} />
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TodoAllLists;
