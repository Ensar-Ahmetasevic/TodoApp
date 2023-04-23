import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

import ListQuery from "./list-query";

export function ListMutations() {
  const queryClient = useQueryClient();

  // ** CREATE MUTATION **

  const createListMutation = useMutation(
    async (listName) => {
      try {
        const response = await axios.post("/api/lists", listName);
        return response.data;
      } catch (error) {
        console.error("Failed to create new Todo List:", error);
        toast.error(`Failed to create new Todo List: ${error.message}`);
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
        const response = await axios.put("/api/lists", updatedList);
        return response.data;
      } catch (error) {
        console.error("Failed to update list:", error);
        toast.error(`Failed to update list: ${error.message}`);
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

  // ** CHECKBOX MUTATION **

  const toggleCheckBoxMutation = useMutation(
    async (updatedList) => {
      try {
        const response = await axios.patch("/api/lists", updatedList);
        return response.data;
      } catch (error) {
        console.error("Failed to complete list:", error);
        toast.error(`Failed to complete ToDo List: ${error.message}`);
        throw error; // Throw the error to trigger onError callback
      }
    },

    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("listItems");
        if (data.checkBox === true) {
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
        const response = await axios.delete("/api/lists", { data: { id } });
        return response.data;
      } catch (error) {
        console.error("Failed to DELETE list:", error);
        toast.error(`Failed to DELETE ToDo List: ${error.message}`);
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

  // I am sending those properties through "TodoMutations function" for "todo.js"
  const { isLoading, isError, error, data } = ListQuery();

  return {
    queryClient,
    isLoading,
    isError,
    error,
    data,
    updateListMutation,
    toggleCheckBoxMutation,
    deleteListMutation,
    createListMutation,
  };
}
