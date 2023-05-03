import { useQuery } from "react-query";
import axios from "axios";

const FetchAwsUrlData = async (todoId) => {
  console.log("url-query:", todoId);
  const response = await axios.get("/api/file", { params: { todoId } });
  const URLdata = response.data;
  //console.log("Ovo je respose data:", URLdata);
  return URLdata;
};

const AwsUrlQuery = (todoId) => {
  return useQuery(["todoURL", todoId], () => FetchAwsUrlData(todoId));
};

export default AwsUrlQuery;
