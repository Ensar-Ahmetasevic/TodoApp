import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Link from "next/link";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import { authMutations } from "@/requests/requests-for-auth/auth-mutations";
import TodoListQuery from "@/requests/requests-for-todo-lists/todo-list-query";
import LoadingSpinner from "@/helpers/loading-spiner";
import ErrorNotification from "@/helpers/error";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { isLoading, isError, error } = TodoListQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { createUser } = authMutations();

  // The callback function "prevState => !prevState" takes the previous value of "isLogin" and returns the opposite value.
  //   function switchAuthModeHandler() {
  //     setIsLogin((prevState) => !prevState);
  //   }

  async function submitHandler(data) {
    const enteredEmail = data.emailInput;
    const enteredPassword = data.passwordInput;

    try {
      const result = await createUser.mutateAsync({
        email: enteredEmail,
        password: enteredPassword,
      });

      if (result.status) {
        router.replace("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorNotification error={error} />;

  return (
    <section className="max-w-md w-full mx-auto sm:mt-10">
      <h1 className="text-3xl text-center font-bold mb-8 sm:text-2xl">
        SignUp
      </h1>

      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="mx-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Your Email
          </label>
          <input
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
            {...register("emailInput", { required: true })}
            type="email"
            id="email"
          />
        </div>

        <div className="mb-4 mx-4 relative">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Your Password
          </label>
          <input
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full pr-10"
            {...register("passwordInput", { required: true })}
            type={!showPassword ? "password" : "text"}
            id="password"
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
          >
            {isSubmitting ? <LoadingSpinnerButton /> : "Create Account"}
          </button>

          <Link
            className="text-s text-blue-300 hover:text-blue-500 mt-2 sm:mt-2"
            href="/auth/login"
          >
            Login with existing account
          </Link>
        </div>
      </form>
    </section>
  );
}

export default SignupForm;
