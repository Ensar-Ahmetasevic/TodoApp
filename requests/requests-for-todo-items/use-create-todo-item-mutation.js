import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function useCreateTodoItemMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const listID = router.query.todoItems;

  const createTodoItemMutation = async (newTodo) => {
    try {
      const response = await axios.post(`/api/todos/${listID}`, newTodo);
      return response.data; // Return the response data
    } catch (error) {
      console.error("Failed to create todo:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(createTodoItemMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("todoItems");
      /*
        Automatically updates the cached data with the new data, this ensures that the list of Todo Items
        displayed in the UI is always showing the latest data.
      */
      toast.success("ToDo created successfully.", { autoClose: 2000 });
    },
  });
}

export default useCreateTodoItemMutation;
