import { sortBy, map, filter } from "lodash";
import { useRouter } from "next/router";

import SingleItem from "./single-todo";
import { TodoMutations } from "../todo-react-query/todo-mutations";
import ListQuery from "../../todo-lists/list-react-query/list-query";

export default function AllItems() {
  const router = useRouter();
  const listID = parseInt(router.query.todoListID);

  const { data } = TodoMutations();
  const { data: listsData } = ListQuery();

  const filterNameById = (listsData, id) => {
    const filteredLists = _.filter(listsData?.allLists, { id });
    return _.map(filteredLists, "name");
  };

  const listName = filterNameById(listsData, listID);

  return (
    <section>
      <div className="flex flex-row justify-end">
        <div className="flex flex-col ">
          <button
            className="py-1 px-2 rounded-lg border-2 border-solid border-yellow-400 hover:border-yellow-600"
            onClick={() => router.push("/lists")}
          >
            {listName}
          </button>
        </div>
      </div>
      <ul>
        {_.sortBy(data.allItems, ["checkBox"]).map((item) => (
          // first sort "items" wher "checkBox" value is "true" and then whit value "false"

          <SingleItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
