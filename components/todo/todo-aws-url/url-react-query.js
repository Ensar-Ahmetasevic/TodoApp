import { useQuery } from "react-query";
import axios from "axios";

const FetchAwsUrlData = async (todoId) => {
  console.log("step2", todoId);
  const response = await axios.get("/api/file", { params: { todoId } });
  const URLdata = response.data;
  return URLdata;
};

const AwsUrlQuery = (todoId) => {
  return useQuery(["todoURL", todoId], () => FetchAwsUrlData(todoId));
};

export default AwsUrlQuery;
