import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export function authMutations() {
  const queryClient = useQueryClient();

  const createUser = useMutation(
    async (email, password) => {
      try {
        const response = await axios.post("/api/auth/signup", {
          email,
          password,
        });
        return response.data;
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error(error.response.data.message);
        throw error; // Throw the error to trigger onError callback
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        /*
            Automatically updates the cached data with the new data, this ensures that the list of users
            displayed in the UI is always showing the latest data.
        */
        toast.success("User created successfully.", { autoClose: 700 });
      },
    }
  );

  return { createUser };
}
