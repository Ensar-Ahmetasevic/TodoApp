import _ from "lodash";

import SingleItem from "./single-todo";
import { TodoMutations } from "./todo-react-query/todo-mutations";

export default function AllItems() {
  const { data } = TodoMutations();

  return (
    <section>
      <ul>
        {_.sortBy(data.allItems, ["checkBox"]).map((item) => (
          // first sort "items" wher "checkBox" value is "true" and then whit value "false"
          <SingleItem item={item} />
        ))}
      </ul>
    </section>
  );
}
