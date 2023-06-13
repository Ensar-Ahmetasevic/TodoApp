import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

function useChangePasswordMutation() {
  const queryClient = useQueryClient();

  const changePasswordMutation = async (passwordData) => {
    try {
      const response = await axios.patch(
        "/api/user/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(`Failed to change password: ${error.response.data.message}`, {
        autoClose: 2000,
      });
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(changePasswordMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("userProfile");
      toast.success("You have successfully changed your password.", {
        autoClose: 2000,
      });
    },
  });
}

export default useChangePasswordMutation;
