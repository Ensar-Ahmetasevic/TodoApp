import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

function useSignupAuthMutation() {
  const queryClient = useQueryClient();

  const signupAuthMutation = async (userData) => {
    try {
      const response = await axios.post("/api/auth/signup", {
        userData,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response.data.message);
      throw error; // Throw the error to trigger onError callback
    }
  };

  return useMutation(signupAuthMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      /*
          Automatically updates the cached data with the new data, this ensures that the list of users
          displayed in the UI is always showing the latest data.
      */
      toast.success("User created successfully.", { autoClose: 1500 });
    },
  });
}

export default useSignupAuthMutation;
