"use client";
import { navigate } from "@/functions/actions";
import { useEffect, useRef, useState } from "react";

export default function Sidebar({
  username,
  currentPath,
}: {
  username: string;
  currentPath: string;
}) {
  const [showLogOutBox, setShowLogOut] = useState(false);
  const logoutBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        logoutBoxRef.current &&
        !logoutBoxRef.current.contains(event.target as Node)
      ) {
        setShowLogOut(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => currentPath === path;
  const linkClass = (path: string) =>
    `inline-block px-2 py-1 rounded transition-colors duration-200 group-hover:bg-gray-700 ${
      isActive(path) ? "font-bold italic" : " font-light "
    }`;

    const logOut = async () => {
      const response = await fetch('/api/deletecookie', {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      if (response.status == 200) {
        navigate("/")
      }
    }
  return (
    <div className="flex">
      <header className="flex xl:p-4 xl:flex xl:flex-col xl:min-h-screen xl:w-52 w-full xl:items-start items-center justify-between">
        <div className="flex flex-row xl:flex xl:flex-col">
          <h1 className="pl-2 text-4xl font-bold hover:animate-shake">
            <a href="/">musipster</a>
          </h1>
        </div>
        <div className="xl:flex-grow">
          <ul className="flex xl:mt-10 xl:flex-col xl:gap-5">
            <a href="/dashboard" className="group">
              <li className={linkClass("/dashboard")}>Dashboard</li>
            </a>
            <a href="/graph" className="group">
              <li className={linkClass("/graph")}>Graph</li>
            </a>
            {/* <a className="group cursor-pointer">
                <li className={linkClass("/discover")}>Discover (WIP)</li>
              </a>
              <a className="group cursor-pointer">
                <li className={linkClass("/playlists")}>Playlists (WIP)</li>
              </a> */}
            <a href="/settings" className="group cursor-pointer">
              <li className={linkClass("/settings")}>Settings</li>
            </a>
            <a href="/faq" className="group">
              <li className={linkClass("/faq")}>FAQ</li>
            </a>
          </ul>
        </div>
        <div className="pl-2" ref={logoutBoxRef}>
          {showLogOutBox ? (
            <button
              onClick={logOut}
              className=" bg-red-400 py-2 px-4 w-fit rounded-2xl"
            >
              Log Out
            </button>
          ) : (
            <button onClick={() => setShowLogOut(true)}>
              <h1 className="w-fit">@danieljayhwang</h1>
            </button>
          )}
        </div>
      </header>
      <div className="w-[1px] bg-gray-700 h-screen hidden xl:block"></div>
    </div>
  );
}
