// src/Components/Login.js
"use client";
import React, { useState } from "react";
import { submitLoginForm } from "./submitLoginForm";
import { navigate } from "@/functions/actions";
import { isAuthenticated } from "@/functions/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      credentials: "include",
    });

    if (response.status == 200) {
      console.log("logged in");
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  return (
    <form
      className="h-screen flex flex-col lg:flex-row justify-center space-y-10 lg:space-y-0 lg:space-x-16 items-center my-2 mx-5 lg:mx-0 lg:my-0"
      onSubmit={handleSubmit}
    >
      <div className="lg:w-1/3 max-w-sm">
        {/* <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        /> */}
        <h1 className="text-9xl">musipster</h1>
      </div>
      <div className="lg:w-1/3 max-w-sm">
        <label className="mr-1 text-4xl">Sign in with</label>
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"></div>
        <input
          className="w-full px-4 py-2 border border-solid border-gray-300 rounded text-black"
          type="text"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4 text-black"
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="mt-4 flex justify-between font-semibold text-xl">
          <a
            className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
        <div className="text-center lg:text-left">
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-lg tracking-wider"
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-xl text-slate-500 text-center lg:text-left">
          Don&apos;t have an account?{" "}
          <a
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="#"
          >
            Register
          </a>
        </div>
      </div>
    </form>
  );
};

export default Login;
