import { useForm } from "react-hook-form";
import { useState } from "react";
import LoadingSpinnerButton from "@/helpers/loading-spiner-button";

function ProfileForm({ onChangePassword }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const { isLoading } = onChangePassword;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function submitHandler(data) {
    const enteredOldPassword = data.oldPassword;
    const enteredNewPassword = data.newPassword;

    try {
      await onChangePassword.mutate({
        // ".mutate" is necessary to trigger the mutation.
        // Await the API call
        oldPassword: enteredOldPassword,
        newPassword: enteredNewPassword,
      });
      reset();
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  }

  function toggelNewPasswordInput() {
    setShowNewPassword(!showNewPassword);
  }
  function toggelOldPasswordInput() {
    setShowOldPassword(!showOldPassword);
  }

  return (
    <form
      className="max-w-md mx-auto px-4 "
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="mb-4 relative">
        <label htmlFor="new-password" className="block font-semibold mb-1">
          New Password
        </label>
        <input
          {...register("newPassword", { required: true })}
          type={showNewPassword ? "text" : "password"}
          id="new-password"
          className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full  pr-12"
        />
        <button
          type="button"
          onClick={toggelNewPasswordInput}
          className="absolute top-9 right-2 mr-1 mt-1 text-xs text-gray-400 hover:text-gray-800 hover:font-bold"
        >
          {showNewPassword ? "Hide" : "Show"}
        </button>
        <div className="mt-2 italic text-gray-300 text-sm">
          {errors.newPassword && <p> This field is required </p>}
        </div>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="old-password" className="block font-semibold mb-1">
          Old Password
        </label>
        <input
          {...register("oldPassword", { required: true })}
          type={showOldPassword ? "text" : "password"}
          id="old-password"
          className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full  pr-12"
        />
        <button
          type="button"
          onClick={toggelOldPasswordInput}
          className="absolute top-9 right-2  mr-1 mt-1 text-xs text-gray-400 hover:text-gray-800 hover:font-bold"
        >
          {showOldPassword ? "Hide" : "Show"}
        </button>
        <div className="mt-2 italic text-gray-300 text-sm">
          {errors.oldPassword && <p> This field is required </p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
          type="submit"
        >
          {isLoading ? <LoadingSpinnerButton /> : "Change Password"}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
