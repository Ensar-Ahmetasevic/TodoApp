import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import AwsUrlQuery from "./url-react-query";

export function URLMutations() {
  const queryClient = useQueryClient();

  // ** CREATE URL MUTATION **
  const createURLMutation = useMutation(
    async (URLData) => {
      try {
        const response = await axios.post("/api/file", URLData);
        return response.data; // Return the response data
        console.log("Response from url-mutation file:", response);
      } catch (error) {
        console.error("Failed to create todo URL:", error);
        toast.error(`Failed to create todo URL: ${error.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoURL");
        /*
          Automatically updates the cached data with the new data, this ensures that the list of Todo URL Items
          displayed in the UI is always showing the latest data.
        */
        toast.success("ToDo File created successfully.", { autoClose: 700 });
      },
    }
  );

  return {
    createURLMutation,
  };
}
