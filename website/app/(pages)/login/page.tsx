// src/Components/Login.js
"use client";
import { navigate } from "@/functions/actions";
import { googleAuth } from "@/functions/api";
import Image from "next/image";

export default function Login() {
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const response = await googleAuth();
    navigate(response.url);
  };

  return (
    <form className="h-screen flex flex-col lg:flex-row justify-center space-y-10 lg:space-y-0 lg:space-x-16 items-center my-2 mx-5 lg:mx-0 lg:my-0">
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
        <div className="flex justify-center items-center">
          <button
            onClick={handleLogin}
            className="flex bg-white p-2 text-black items-center gap-2 rounded-2xl"
          >
            <Image src="/google.svg" alt="" width={30} height={30} />
            <p>Sign in with Google</p>
          </button>
        </div>
      </div>
    </form>
  );
}
