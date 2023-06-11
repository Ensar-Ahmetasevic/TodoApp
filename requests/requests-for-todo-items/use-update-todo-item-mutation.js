import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function useUpdateTodoItemMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const listID = router.query.todoItems;

  const updateTodoItemMutation = async (updatedTodo) => {
    try {
      const response = await axios.put(`/api/todos/${listID}`, updatedTodo);
      return response.data;
    } catch (error) {
      console.error("Failed to update todo:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(updateTodoItemMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("todoItems");
      toast.success("ToDo updated successfully.", { autoClose: 2000 });
    },
  });
}

export default useUpdateTodoItemMutation;
