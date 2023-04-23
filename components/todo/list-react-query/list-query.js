import { useQuery } from "react-query";
import axios from "axios";

const FetchListsData = async () => {
  const response = await axios.get("/api/lists");
  return response.data;
};

const ListQuery = () => {
  return useQuery("listItems", FetchListsData);
};

export default ListQuery;
