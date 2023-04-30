import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";

const FetchTodosData = async (listID) => {
  const response = await axios.get(`/api/todos/${listID}`);
  return response.data;
};

const TodoItemsQuery = () => {
  const router = useRouter();
  const listID = router.query.todoListID;
  return useQuery(["todoItems", listID], () => FetchTodosData(listID));
  // "listID" is the value from the params parameters. This ensures that the "useQuery" hook will re-fetch the data whenever the "listID" value changes.
  // useQuery("todoItems", FetchTodosData);
};

export default TodoItemsQuery;
