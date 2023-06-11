import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function useCreateAwsUrlMutation() {
  const queryClient = useQueryClient();

  const createAwsUrlMutation = async (URLData) => {
    try {
      const response = await axios.post("/api/awsAPI", URLData);

      return response.data; // Return the response data
    } catch (error) {
      console.error("Failed to create file URL:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error(); // Throw the error to trigger onError callback
    }
  };

  return useMutation(createAwsUrlMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("todoURL");
      /*
        Automatically updates the cached data with the new data, this ensures that the list of Todo URL Items
        displayed in the UI is always showing the latest data.
      */
      toast.success("File was created successfully.", { autoClose: 1000 });
    },
  });
}

export default useCreateAwsUrlMutation;
