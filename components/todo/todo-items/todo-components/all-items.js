import _ from "lodash";

import SingleItem from "./single-todo";
import { TodoMutations } from "../todo-react-query/todo-mutations";

export default function AllItems() {
  const { data } = TodoMutations();

  return (
    <section>
      <div>
        <p>Your List: LIST NAME</p>
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
