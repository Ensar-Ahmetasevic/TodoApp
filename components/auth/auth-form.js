import { useState } from "react";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";

import LoadingSpinnerButton from "@/helpers/loading-spiner-button";
import { authMutations } from "./auth-mutations";

async function createUser(email, password) {
  try {
    const response = await axios.post("/api/auth/signup", { email, password });
    return response.data;
  } catch (error) {
    // Handle error
    console.error("Error creating user:", error);
    toast.error(error.response.data.message);
    throw error;
  }
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const { createUser } = authMutations();

  // const emailInputRef = useRef();
  // const passwordInputRef = useRef();

  // The callback function "prevState => !prevState" takes the previous value of "isLogin" and returns the opposite value.
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(data) {
    const enteredEmail = data.emailInput;
    const enteredPassword = data.passwordInput;

    if (isLogin) {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      if (!result.error) {
        router.replace(`/lists`);
      } else {
        toast.error(result.error);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const result = await createUser(enteredEmail, enteredPassword);
        if (result.status) {
          toast.success(result.message, { autoClose: 2000 });
          router.replace("/");

          setTimeout(() => {
            toast.info("Use your Email and Password to Login", {
              position: "bottom-center",
              autoClose: 7000,
            });
          }, 2000);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <section className="max-w-md w-full mx-auto">
      <h1 className="text-3xl text-center font-bold mb-8">
        {isLogin ? "Login" : "SignUp"}
      </h1>

      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
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
        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Your Password
          </label>
          <input
            {...register("passwordInput", { required: true })}
            type={!showPassword ? "password" : "text"}
            id="password"
            required
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full pr-10" // Add pr-10 for padding on the right to accommodate the button
          />
          <button
            className="absolute top-8 right-2 mt-2 text-xs text-gray-400 hover:text-gray-800 hover:font-bold" // Adjust top, right, and margin properties as needed
            type="button"
            onClick={toggleShowPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinnerButton />
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </button>
          <button
            type="button"
            onClick={switchAuthModeHandler}
            className="text-s text-blue-300 hover:text-blue-500  mt-2 sm:mt-0"
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
