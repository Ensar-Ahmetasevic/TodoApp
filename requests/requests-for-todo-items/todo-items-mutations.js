import { useMutation, useQueryClient } from "react-query";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function TodoItemMutations() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const listID = router.query.todoItems;

  // ** CREATE MUTATION **
  const createTodoMutation = useMutation(
    async (newTodo) => {
      try {
        const response = await axios.post(`/api/todos/${listID}`, newTodo);
        return response.data; // Return the response data
      } catch (error) {
        console.error("Failed to create todo:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
        /*
          Automatically updates the cached data with the new data, this ensures that the list of Todo Items
          displayed in the UI is always showing the latest data.
        */
        toast.success("ToDo created successfully.", { autoClose: 700 });
      },
    }
  );

  // ** UPDATE MUTATION **

  const updateTodoMutation = useMutation(
    async (updatedTodo) => {
      try {
        const response = await axios.put(`/api/todos/${listID}`, updatedTodo);
        return response.data;
      } catch (error) {
        console.error("Failed to update todo:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
        toast.success("ToDo updated successfully.", { autoClose: 700 });
      },
    }
  );

  // ** isComplete MUTATION **

  const toggleisCompleteMutation = useMutation(
    async (updatedTodo) => {
      try {
        const response = await axios.patch(`/api/todos/${listID}`, updatedTodo);
        return response.data;
      } catch (error) {
        console.error("Failed to complete todo:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },

    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("todoItems");
        if (data.isComplete === true) {
          toast.success("ToDo is successfully complete."), { autoClose: 700 };
        }
      },
    }
  );

  // ** DELETE MUTATION **

  const deleteTodoMutation = useMutation(
    async (id) => {
      try {
        const response = await axios.delete(`/api/todos/${listID}`, {
          data: { id },
        }); // Pass "id" as part of the request body
        return response.data;
      } catch (error) {
        console.error("Failed to DELETE todo:", error);
        toast.error(`Error: ${error.response.data.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
        toast.success("ToDo is successfully DELETED.", { autoClose: 700 });
      },
    }
  );

  return {
    createTodoMutation,
    updateTodoMutation,
    toggleisCompleteMutation,
    deleteTodoMutation,
  };
}

export default TodoItemMutations;
