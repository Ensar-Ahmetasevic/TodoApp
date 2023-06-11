import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function useDeleteAwsUrlMutation() {
  const queryClient = useQueryClient();

  const deleteAwsUrlMutation = async (URLid) => {
    try {
      const response = await axios.delete("/api/awsAPI", { data: { URLid } });
      return response.data;
    } catch (error) {
      console.error("Failed to DELETE list:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(deleteAwsUrlMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("todoURL");
      toast.success("Your Files is successfully DELETED.", {
        autoClose: 1000,
      });
    },
  });
}

export default useDeleteAwsUrlMutation;
