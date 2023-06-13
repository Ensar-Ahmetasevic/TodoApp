import { sortBy, map, filter } from "lodash";
import { useRouter } from "next/router";

import useTodoListQuery from "../../../requests/requests-for-todo-lists/use-todo-list-query";
import useTodoItemsQuery from "../../../requests/requests-for-todo-items/use-todo-items-query";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";
import SingleTodoItem from "./todo-item-components/single-todo-item";

function AllTodoItems() {
  const router = useRouter();
  const listID = parseInt(router.query.todoItems);

  const { data: itemsData, error, isLoading, isError } = useTodoItemsQuery();
  const { data: listsData } = useTodoListQuery();

  const filterNameById = (listsData, id) => {
    const filteredLists = filter(listsData?.allLists, { id });
    return map(filteredLists, "name");
  };

  const listName = filterNameById(listsData, listID);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section className=" grid grid-cols-6 gap-4 mx-20 sm:mx-5">
      <div className=" col-start-2 col-span-4 sm:col-start-1 sm:col-span-7">
        <div className="flex flex-row justify-between mt-10">
          <div className="flex flex-col ">
            <button
              className="py-1 px-2 ml-5 sm:ml-0 rounded-lg border-2 border-solid border-yellow-400 hover:border-yellow-600"
              onClick={() => router.push("/todos/todo-lists")}
            >
              {listName}
            </button>
          </div>
          <div>
            <p></p>
            <button
              className="py-1 px-2 mr-5 sm:mr-0 rounded-lg border-2 border-solid border-gray-500 hover:border-gray-300"
              onClick={() => router.push("/todos/todo-lists")}
            >
              Back
            </button>
          </div>
        </div>
        <ul>
          {sortBy(itemsData?.allItems, ["isComplete"]).map((item) => (
            // first sort "items" wher "isComplete" value is "true" and then whit value "false"

            <SingleTodoItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AllTodoItems;
