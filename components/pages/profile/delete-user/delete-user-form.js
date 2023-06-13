import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

import LoadingSpinnerButton from "@/components/shared/loading-spiner-button";
import useDeleteUserMutation from "@/requests/requests-for-user-profile/use-delete-user-mutation";

function DeleteUSerForm() {
  const [showPassword, setShowPassword] = useState(false);

  const deleteUserMutation = useDeleteUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function submitHandler(data) {
    const enteredPassword = data.password;

    try {
      await deleteUserMutation.mutateAsync({
        enteredPassword,
      });
      reset();
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  }

  function toggleHideShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <form
      className="max-w-md mx-auto px-4 "
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="mb-4 relative">
        <label htmlFor="password" className="block font-semibold mb-3">
          Enter Password
        </label>

        <input
          className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 pr-12 w-full "
          id="password"
          type={showPassword ? "text" : "password"}
          {...register("password", { required: true })}
        />

        <button
          className="absolute top-11 right-2 mr-1 mt-1 text-xs text-gray-400 hover:text-gray-800 hover:font-bold"
          type="button"
          onClick={toggleHideShowPassword}
        >
          {showPassword ? "Hide" : "Show"}
        </button>

        <div className="mt-2 italic text-gray-300 text-sm">
          {errors.password && <p> This field is required </p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-red-600 hover:bg-red-700  text-white py-2 px-4 rounded-md"
          type="submit"
          disabled={isSubmitting}
        >
          {deleteUserMutation.isLoading ? <LoadingSpinnerButton /> : "Delete"}
        </button>
        <Link
          className="border-2 border-white hover:bg-slate-500 ml-3 text-white py-2 px-4 rounded-md"
          href={".."}
        >
          {" "}
          Cancel{" "}
        </Link>
      </div>
    </form>
  );
}

export default DeleteUSerForm;
