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
            <a href="my-artists" className="group">
              <li className={linkClass("/my-artists")}>My Artists</li>
            </a>
            <a className="group cursor-pointer">
              <li className={linkClass("/discover")}>Discover (WIP)</li>
            </a>
            <a className="group cursor-pointer">
              <li className={linkClass("/playlists")}>Playlists (WIP)</li>
            </a>
            <a href="/settings" className="group">
              <li className={linkClass("/settings")}>Settings</li>
            </a>
            <a href="/help" className="group">
              <li className={linkClass("/help")}>Help/FAQ</li>
            </a>
          </ul>
        </div>
        <div className="logout pl-2">
          <button>
            <h1>@{username}</h1>
          </button>
        </div>
      </header>
      <div className="w-[1px] bg-gray-700 h-screen"></div>
    </div>
  );
}
