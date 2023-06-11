import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function useDeleteTodoListMutations() {
  const queryClient = useQueryClient();

  const deleteTodoListMutations = async (id) => {
    try {
      const response = await axios.delete("/api/todos/lists", {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to DELETE list:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(deleteTodoListMutations, {
    onSuccess: () => {
      queryClient.invalidateQueries("listItems");
      toast.success("ToDo List is successfully DELETED.", { autoClose: 2000 });
    },
  });
}

export default useDeleteTodoListMutations;
