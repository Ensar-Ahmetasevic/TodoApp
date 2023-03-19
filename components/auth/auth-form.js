import { useState, useRef } from "react";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

import { toast } from "react-toastify";

async function createUser(email, password) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
}

function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  // The callback function "prevState => !prevState" takes the previous value of "isLogin" and returns the opposite value.
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  // function switchAuthModeHandler() {
  //   setIsLogin(function(prevState) {
  //     return !prevState;               takes the previous value of "isLogin" and returns the opposite value.
  //   });
  // }

  async function submitHandler(event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      if (!result.error) {
        router.replace("/todo");
      } else {
        toast.error(result.error);
      }
    } else {
      try {
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
    }
  }

  return (
    <section className="max-w-md w-full mx-auto">
      <h1 className="text-3xl text-center font-bold mb-8">
        {isLogin ? "Login" : "Sign Up"}
      </h1>

      <form className="flex flex-col space-y-4" onSubmit={submitHandler}>
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            Your Email
          </label>
          <input
            ref={emailInputRef}
            type="email"
            id="email"
            required
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">
            Your Password
          </label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
            className="border border-gray-300 font-bold text-slate-800 rounded-md p-2 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out">
            {isLogin ? "Login" : "Create Account"}
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
