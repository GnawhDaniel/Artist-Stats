"use client";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { User } from "@/components/interfaces";
import { useEffect, useState } from "react";
import { getUser } from "@/functions/api";
import { loadingElement } from "@/components/loading";
import { error } from "console";
import BottomBar from "@/components/bottombar";

export default function Help() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [confirmBox, setConfirmBox] = useState(false);

  // Call get all artists on page load
  useEffect(() => {
    async function init() {
      const user = await getUser();
      setUser(user);
      setLoading(false);
    }
    init();
  }, [msg]);

  // Clear Message after x seconds
  useEffect(() => {
    if (msg || errorMsg) {
      const timer = setTimeout(() => {
        setMsg("");
        setErrorMsg("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [msg, errorMsg]);

  const changeUserName = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/google-auth/profile/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ new_username: username }),
      });
      if (response.ok) {
        setErrorMsg("");
        setMsg(`Changed username from ${user?.username} to ${username}`);
      } else {
        console.log(response);
        let res = await response.json();
        console.log(res);
        setMsg("");
        setErrorMsg(res.message);
      }
    } catch {}
  };

  const deleteAccount = async () => {
    try {
        const response = await fetch("/api/google-auth/profile/delete", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
            window.location.reload();
        } 
      } catch {}
  }

  return (
    <div className="flex min-h-screen h-[100%] flex-col items-center">
      {msg ? (
        <h1 className="absolute bg-green-500 bottom-0 mb-5 p-4 rounded-xl">
          {msg}
        </h1>
      ) : (
        <></>
      )}
      {errorMsg ? (
        <h1 className="absolute bg-red-500 bottom-0 mb-5 p-4 rounded-xl">
          {errorMsg}
        </h1>
      ) : (
        <></>
      )}

      <div className="flex flex-row sm:flex-col xl:max-w-[90%] w-full">
        <div className="hidden sm:block">
          <Sidebar
            username={user?.username ?? ""}
            currentPath={usePathname() ?? ""}
          />
        </div>
        {loading ? (
          loadingElement
        ) : (
          <div className="p-4 w-full">
            <h1 className="font-extrabold text-5xl italic">Settings</h1>
            <hr className="border-t-2 border-white my-2" />
            <div className="flex flex-col sm:flex-row h-full gap-5">
              <div className="bg-orange-400 p-4 rounded-2xl">
                <h1>Change Username</h1>
                <hr className="border-t-2 border-orange-200 my-2" />
                <form onSubmit={changeUserName} className="flex flex-col">
                  <label htmlFor="new_username">New Username</label>
                  <input
                    type="text"
                    name="new_username"
                    className="rounded-lg text-black p-1"
                    onChange={(e) => setUsername(e.target.value)}
                    spellCheck="false"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-3 bg-orange-600 rounded-3xl hover:bg-orange-500"
                  >
                    Submit
                  </button>
                </form>
              </div>

              <div className="bg-red-400 p-4 rounded-2xl h-fit">
                <h1>Delete Account</h1>
                <hr className="border-t-2 border-orange-200 my-2" />
                {confirmBox ? (
                  <div className="flex flex-col gap-2">
                    <button onClick={()=>deleteAccount()} className="bg-red-500 rounded-xl p-2">Delete</button>
                    <button onClick={()=>setConfirmBox(false)} className="bg-green-500 rounded-xl p-2">Do Not Delete</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmBox(true)}
                    className="bg-red-500 p-3 rounded-xl "
                  >
                    Delete My Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <BottomBar></BottomBar>
      </div>
    </div>
  );
}
