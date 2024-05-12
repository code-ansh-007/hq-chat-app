import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/login",
        data
      );
      if (res.data.token) {
        localStorage.setItem("user:token", res.data.token);
        localStorage.setItem("user:details", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (error) {
      alert("Invalid Credentials or incomplete fields");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <form class="max-w-sm mx-auto w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-10 text-center">
          <span className="text-3xl font-bold">Login to ChaiChat</span>
          <span>Chat over a cup of chai...</span>
        </div>
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="johndoe@example.com"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        <div className="mt-5">
          <span>
            Don't have an account ?{" "}
            <span
              className="text-blue-500 underline"
              onClick={() => {
                navigate("/user/signup");
              }}
            >
              Create Account
            </span>
          </span>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
