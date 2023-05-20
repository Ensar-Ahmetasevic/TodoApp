import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

function TodoListMutations() {
  const queryClient = useQueryClient();

  // ** CREATE MUTATION **

  const createListMutation = useMutation(
    async (listName) => {
      try {
        const response = await axios.post("/api/todos/lists", listName);
        return response.data;
      } catch (error) {
        console.error("Failed to create new Todo List:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listItems");
        toast.success("ToDo List updated successfully.", { autoClose: 700 });
      },
    }
  );

  // ** UPDATE MUTATION **

  const updateListMutation = useMutation(
    async (updatedList) => {
      try {
        const response = await axios.put("/api/todos/lists", updatedList);
        return response.data;
      } catch (error) {
        console.error("Failed to update list:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("listItems");
        toast.success("ToDo List updated successfully.", { autoClose: 700 });
      },
    }
  );

  // ** isComplete MUTATION **

  const toggleisCompleteMutation = useMutation(
    async (updatedList) => {
      try {
        const response = await axios.patch("/api/todos/lists", updatedList);
        return response.data;
      } catch (error) {
        console.error("Failed to complete list:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },

    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("listItems");
        if (data.isComplete === true) {
          toast.success("ToDo List is successfully complete."),
            { autoClose: 700 };
        }
      },
    }
  );

  // ** DELETE MUTATION **

  const deleteListMutation = useMutation(
    async (id) => {
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
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("listItems");
        toast.success("ToDo List is successfully DELETED.", { autoClose: 700 });
      },
    }
  );

  return {
    updateListMutation,
    toggleisCompleteMutation,
    deleteListMutation,
    createListMutation,
  };
}

export default TodoListMutations;
