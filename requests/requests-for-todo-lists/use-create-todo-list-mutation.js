import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function useCreateTodoListMutation() {
  const queryClient = useQueryClient();

  const createTodoListMutation = async (listName) => {
    try {
      const response = await axios.post("/api/todos/lists", listName);
      return response.data;
    } catch (error) {
      console.error("Failed to create new Todo List:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(createTodoListMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("listItems");
      toast.success("ToDo List created successfully.", { autoClose: 2000 });
    },
  });
}

export default useCreateTodoListMutation;
