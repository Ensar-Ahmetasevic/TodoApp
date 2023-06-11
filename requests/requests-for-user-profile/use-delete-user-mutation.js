import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { signOut } from "next-auth/client";

function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  const deleteUserMutation = async (enteredPassword) => {
    try {
      const response = await axios.delete("/api/user/delete-user", {
        data: enteredPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to DELETE user:", error);
      toast.error(`Error: ${error.response.data.message}`);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(deleteUserMutation, {
    onSuccess: () => {
      signOut();
      queryClient.invalidateQueries(); // Invalidate all queries

      toast.success("Account is successfully DELETED.", {
        autoClose: 2000,
      });
    },
  });
}

export default useDeleteUserMutation;
