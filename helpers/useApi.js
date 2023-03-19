import { useQuery, useMutation, useQueryClient } from "react-query";

export function useTodoItems() {
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery(
    "todoItems",
    async () => {
      const res = await fetch("/api/items");
      return res.json();
    }
  );

  const addTodoMutation = useMutation(
    (newTodo) =>
      fetch("/api/items", {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
        /*
            When the onSuccess function is called, it invalidates the cache for the 
            "todoItems" query key, causing any queries that depend on that data to be 
            refetched on the next render.
            */
      },
    }
  );

  const updateTodoMutation = useMutation(
    (updatedTodo) =>
      fetch("/api/items", {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  const toggleCheckBoxMutation = useMutation(
    (updatedTodo) =>
      fetch("/api/items", {
        method: "PATCH",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  const deleteTodoMutation = useMutation(
    (id) =>
      fetch("/api/items", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todoItems");
      },
    }
  );

  return {
    queryClient,
    isLoading,
    isError,
    error,
    data,
    addTodoMutation,
    updateTodoMutation,
    toggleCheckBoxMutation,
    deleteTodoMutation,
  };
}
