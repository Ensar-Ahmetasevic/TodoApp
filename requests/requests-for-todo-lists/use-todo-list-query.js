import { useQuery } from "react-query";
import axios from "axios";

const FetchListsData = async () => {
  const response = await axios.get("/api/todos/lists");

  return response.data;
};

const useTodoListQuery = () => {
  return useQuery("listItems", FetchListsData);
};

export default useTodoListQuery;
