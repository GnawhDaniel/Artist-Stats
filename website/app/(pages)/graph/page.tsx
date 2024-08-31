"use client";
import Search from "@/components/search";
import Sidebar from "@/components/sidebar";
import Graph from "@/components/graph";
import { useEffect, useState } from "react";
import List from "@/components/List";
import { getAllArtists, getSingleArtist, getUser } from "@/functions/api";
import { usePathname, useSearchParams } from "next/navigation";
import { User } from "@/components/interfaces";
import { loadingElement } from "@/components/loading";
import BottomBar from "@/components/bottombar";

function VerticalText({ text, growth }: { text: string, growth: number }) {
  if (!text) {
    return <></>;
  }

  return (
    <div
      style={{
        writingMode: "vertical-lr",
        textOrientation: "upright",
        letterSpacing: "-12px", // Adjust this value to reduce space between characters
      }}
      className="absolute right-2 top-20 select-none"
    >
      <div className="flex gap-3">
        <div className="bg-slate-800 p-2 rounded-3xl">
          {text.split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </div>
        <div className={`p-2 rounded-3xl ${growth > 0 ? "bg-green-600" : "bg-red-600"}`}>
          <h1>{growth > 0 ? `+${growth}` : growth}</h1>
        </div>
      </div>
    </div>
  );
}

export default function GraphPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{date: string, followers: number}[]>([]);
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMax] = useState(0);
  const [artists, SetArtists] = useState([]);
  const [searchWindow, setSearchWindow] = useState(false);
  const [currentArtist, setArtist] = useState("");
  const [user, setUser] = useState<User>();
  const [totalGrowth, setTotal] = useState<number>(0);
  const [followedDate, setFollowedDate] = useState<Date>(new Date());
  // const searchParams = useSearchParams();

  const handleSearchResult = (data: any) => {
    SetArtists(data);
  };

  // Call get all artists on page load
  useEffect(() => {
    async function init() {
      const res = await getAllArtists();
      const sortedRes = res.sort(
        (a: { artist_name: string }, b: { artist_name: string }) =>
          a.artist_name.toLowerCase() > b.artist_name.toLowerCase() ? 1 : -1
      );
      SetArtists(sortedRes);

      const user = await getUser();
      setUser(user);

      setLoading(false);

      // Check local storage for artists selected from Dashboard
      const storedData = sessionStorage.getItem("redirectData");
      if (storedData) {
        const data = JSON.parse(storedData);
        sessionStorage.removeItem("redirectData");
        onClickArtist(data?.artist_id ?? "", data.artist_name ?? "");
      }
    }
    init();
  }, []);

  const onClickArtist = async (artist_id: string, artist_name: string) => {
    const res = await getSingleArtist(artist_id);
    setData(res["data"]);
    setTotal(res.data[res.data.length-1].followers - res.data[0].followers);
    setMinimum(res["min_followers"]["followers"]);
    setMax(res["max_followers"]["followers"]);
    setArtist(artist_name);

    const [year, month, day] = res["followed_date"].split("-").map(Number);
    setFollowedDate(new Date(Date.UTC(year, month - 1, day)))
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      {searchWindow ? (
        <div className="flex flex-col absolute z-50 bg-gray-800 bg-opacity-90 w-full h-full">
          <button
            className="absolute top-0 right-0 p-5"
            onClick={() => setSearchWindow(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 text-white bg-red-600 rounded-full hover:bg-red-700 transition-all"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="p-14 flex justify-center">
            <div className="relative w-[50%] left-auto right-auto">
              <Search onSearchResult={handleSearchResult}></Search>
              <div
                className="z-20 absolute bg-gray-600 p-3 rounded-md w-full"
                onClick={() => setSearchWindow(false)}
              >
                <List artists={artists} onClickArtist={onClickArtist}></List>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col xl:flex-row xl:max-w-[90%] w-full">
        <div className="hidden sm:block">
          <Sidebar
            username={user?.username ?? ""}
            currentPath={usePathname() ?? ""}
          />
        </div>
        <button
          className="absolute top-0 right-0 p-5"
          onClick={() => setSearchWindow(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 transition-all hover:scale-150 hover:transition-all hover:filter"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
        {loading ? (
          loadingElement
        ) : (
          <>
            <div className="flex flex-col w-full p-4 gap-5 h-[93vh]">
              <Graph artistName={currentArtist} data={data} followedDate={followedDate}></Graph>
            </div>
            <div className="hidden xl:block">
              <VerticalText text={currentArtist} growth={totalGrowth}/>
            </div>
          </>
        )}
        <BottomBar></BottomBar>
      </div>
    </div>
  );
}
