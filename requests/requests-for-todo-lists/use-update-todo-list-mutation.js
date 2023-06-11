import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function useUpdateTodoListMutation() {
  const queryClient = useQueryClient();

  const updateTodoListMutation = async (updatedList) => {
    try {
      const response = await axios.put("/api/todos/lists", updatedList);
      return response.data;
    } catch (error) {
      console.error("Failed to update list:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(updateTodoListMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("listItems");
      toast.success("ToDo List updated successfully.", { autoClose: 2000 });
    },
  });
}

export default useUpdateTodoListMutation;
