import ProfileForm from "./profile-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

function UserProfile() {
  const queryClient = useQueryClient();

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

  return (
    <section>
      <h1 className="text-3xl text-center font-bold mb-8 sm:text-2xl">
        Change Your Password
      </h1>

      <ProfileForm onChangePassword={changePasswordMutation} />
      {/*passing the "changePasswordMutation" object from the "useMutation" hook as a "prop" to the "ProfileForm" component:*/}
    </section>
  );
}

export default UserProfile;
