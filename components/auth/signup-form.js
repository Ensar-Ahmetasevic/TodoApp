import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/client";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import UseSignupAuthMutation from "@/requests/requests-for-auth/use-signUp-auth-mutation";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const signupAuthMutation = UseSignupAuthMutation();

  async function submitHandler(data) {
    const enteredEmail = data.emailInput;
    const enteredPassword = data.passwordInput;

    try {
      const result = await signupAuthMutation.mutateAsync({
        email: enteredEmail,
        password: enteredPassword,
      });

      // When user is created, the user automatically sign in and redirected to the Todo Lists page
      // If the user creation is successful
      if (result.status) {
        const singInResult = await signIn("credentials", {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword,
        });

        if (!singInResult.error) {
          // If there are no errors (!result.error is true), the user is redirected
          router.replace(`/todos/todo-lists`);
        } else {
          toast.error(result.error);
        }
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
