import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function useIsCompletedTodoListMutation() {
  const queryClient = useQueryClient();

  const isCompletedTodoListMutations = async (updatedList) => {
    try {
      const response = await axios.patch("/api/todos/lists", updatedList);
      return response.data;
    } catch (error) {
      console.error("Failed to complete list:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(isCompletedTodoListMutations, {
    onSuccess: () => {
      queryClient.invalidateQueries("listItems");

      toast.success("ToDo List is successfully complete."), { autoClose: 2000 };
    },
  });
}

export default useIsCompletedTodoListMutation;
