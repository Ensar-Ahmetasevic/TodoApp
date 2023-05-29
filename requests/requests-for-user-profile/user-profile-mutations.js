import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { signOut } from "next-auth/client";

export function UserProfileMutations() {
  const queryClient = useQueryClient();

  // ** CHANGE PASSWORD **
  const changePasswordMutation = useMutation(
    async (passwordData) => {
      try {
        const response = await axios.patch(
          "/api/user/change-password",
          passwordData
        );
        return response.data;
      } catch (error) {
        console.error("Failed to change password:", error);
        toast.error(
          `Failed to change password: ${error.response.data.message}`
        );
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userProfile");
        toast.success("You have successfully changed your password.", {
          autoClose: 3000,
        });
      },
    }
  );

  // ** DELETE MUTATION **

  const deleteUserMutation = useMutation(
    async (enteredPassword) => {
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
    },

    {
      onSuccess: () => {
        signOut();
        queryClient.invalidateQueries(); // Invalidate all queries

        toast.success("Account is successfully DELETED.", {
          autoClose: 3000,
        });
      },
    }
  );

  return { changePasswordMutation, deleteUserMutation };
}
