import { useQuery } from "react-query";
import axios from "axios";

const FetchTodosData = async () => {
  const response = await axios.get("/api/items");
  return response.data;
};

const TodoItemsQuery = () => {
  return useQuery("todoItems", FetchTodosData);
};

export default TodoItemsQuery;
