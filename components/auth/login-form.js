import { useState } from "react";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Link from "next/link";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function submitHandler(data) {
    //
    const enteredEmail = data.emailInput;
    const enteredPassword = data.passwordInput;

    // "signIn" function is called with the provided credentials (email and password). It returns a "result" object that contains
    // information about the sign-in process. If "result.error" is falsy, indicating that there was no error during the sign-in
    // process. In that case, it uses the router.replace function to redirect the user to the specified rout.

    const result = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (!result.error) {
      // If there are no errors (!result.error is true), the user is redirected
      router.replace(`/todos/todo-lists`);
    } else {
      toast.error(result.error);
    }
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  if (isSubmitting) return <LoadingSpinner />;
  if (isSubmitting) return <ErrorNotification error={errors} />;

  return (
    <section className="max-w-md w-full mx-auto sm:mt-10">
      <h1 className="text-3xl text-center font-bold mb-8 sm:text-2xl">Login</h1>

      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="mx-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Your Email
          </label>
          <input
            {...register("emailInput", { required: true })}
            type="email"
            id="email"
            required
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4 mx-4 relative">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Your Password
          </label>
          <input
            {...register("passwordInput", { required: true })}
            type={!showPassword ? "password" : "text"}
            id="password"
            required
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full pr-10"
          />
          <button
            className="absolute top-8 right-2 mt-2 text-xs text-gray-400 hover:text-gray-800 hover:font-bold" // Adjust top, right, and margin properties as needed
            type="button"
            onClick={toggleShowPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="mx-4 flex flex-row sm:flex-col items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <LoadingSpinnerButton /> : "Login"}
          </button>
          <Link
            className="text-s text-blue-300 hover:text-blue-500 mt-2 sm:mt-2"
            href="/auth/signup"
          >
            Create new account
          </Link>
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
