import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function useDeleteTodoItemMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const listID = router.query.todoItems;

  const deleteTodoItemMutation = async (id) => {
    try {
      const response = await axios.delete(`/api/todos/${listID}`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to DELETE todo:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error;
    }
  };

  return useMutation(deleteTodoItemMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("todoItems");
      toast.success("ToDo is successfully DELETED.", { autoClose: 700 });
    },
  });
}

export default useDeleteTodoItemMutation;
