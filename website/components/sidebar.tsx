export default function Sidebar({ username, currentPath }: { username: string; currentPath: string }) {
    const isActive = (path: string) => currentPath === path;
  
    const linkClass = (path: string) =>
      `inline-block px-2 py-1 rounded transition-colors duration-200 hover:bg-gray-700 ${
        isActive(path) ? 'font-bold italic' : ' font-light '
      }`;
  
    return (
      <>
        <header className="p-4 flex flex-col min-h-screen justify-between w-52">
          <div>
            <h1 className="pl-2 text-4xl font-bold">musipster</h1>
            <ul className="mt-10 flex flex-col gap-5">
              <li>
                <a href="/dashboard" className={linkClass('/dashboard')}>Dashboard</a>
              </li>
              <li>
                <a href="my-artists" className={linkClass('/my-artists')}>My Artists</a>
              </li>
              <li>
                <a href="/discover" className={linkClass('/discover')}>Discover (WIP)</a>
              </li>
              <li>
                <a href="/playlists" className={linkClass('/playlists')}>Playlists (WIP)</a>
              </li>
              <li>
                <a href="/settings" className={linkClass('/settings')}>Settings</a>
              </li>
              <li>
                <a href="/help" className={linkClass('/help')}>Help/FAQ</a>
              </li>
            </ul>
          </div>
          <div className="logout pl-2">
            <button>
              <h1>@{username}</h1>
            </button>
          </div>
        </header>
        <div className="w-[2px] bg-gray-800"></div>
      </>
    );
  }