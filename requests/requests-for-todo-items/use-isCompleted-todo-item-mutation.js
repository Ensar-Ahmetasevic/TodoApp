import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function useIsCompletedTodoItemMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const listID = router.query.todoItems;

  const isCompletedTodoItemMutation = async (updatedTodo) => {
    try {
      const response = await axios.patch(`/api/todos/${listID}`, updatedTodo);
      return response.data;
    } catch (error) {
      console.error("Failed to complete todo:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(isCompletedTodoItemMutation, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("todoItems");
      if (data.isComplete === true) {
        toast.success("ToDo is successfully complete."), { autoClose: 2000 };
      }
    },
  });
}

export default useIsCompletedTodoItemMutation;
