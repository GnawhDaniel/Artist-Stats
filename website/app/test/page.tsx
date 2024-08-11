function DefaultSidebar({ username, currentPath }: { username: string; currentPath: string }) {
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
              <a href="/user/dashboard" className={linkClass('/user/dashboard')}>Dashboard</a>
            </li>
            <li>
              <a href="/user/my-artists" className={linkClass('/user/my-artists')}>My Artists</a>
            </li>
            <li>
              <a href="/user/discover" className={linkClass('/user/discover')}>Discover (WIP)</a>
            </li>
            <li>
              <a href="/user/playlists" className={linkClass('/user/playlists')}>Playlists (WIP)</a>
            </li>
            <li>
              <a href="/user/settings" className={linkClass('/user/settings')}>Settings</a>
            </li>
            <li>
              <a href="/user/help" className={linkClass('/user/help')}>Help/FAQ</a>
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

// Define Test component
function Test() {
  // You would typically get this from your routing system
  const currentPath = '/user/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="flex max-w-[85%] w-full">
        <DefaultSidebar username="xxxxxxxxxxxxxxx" currentPath={currentPath}/>
        <div className="">content</div>
      </div>
    </div>
  );
}

export default Test;