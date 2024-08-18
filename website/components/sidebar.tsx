import { navigate } from "@/functions/actions";

export default function Sidebar({
  username,
  currentPath,
}: {
  username: string;
  currentPath: string;
}) {

  const isActive = (path: string) => currentPath === path;
  const linkClass = (path: string) =>
    `inline-block px-2 py-1 rounded transition-colors duration-200 group-hover:bg-gray-700 ${
      isActive(path) ? "font-bold italic" : " font-light "
    }`;

  const logOut = async () => {
    const response = await fetch("/api/deletecookie", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status == 200) {
      navigate("/");
    }
  };

  return (
    <div className="flex">
      <header className="p-4 flex flex-col min-h-screen justify-between w-52">
        <div>
          <h1 className="pl-2 text-4xl font-bold hover:animate-shake">
            <a href="/">musipster</a>
          </h1>
          <ul className="mt-10 flex flex-col gap-5">
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
        <div className="flex flex-col logout pl-2 group">
          <button onClick={logOut} className="bg-red-400 py-2 rounded-2xl hidden group-hover:block">
            Log Out
          </button>
          <button className="">
            <h1>@{username}</h1>
          </button>
        </div>
      </header>
      <div className="w-[1px] bg-gray-700 h-screen"></div>
    </div>
  );
}
