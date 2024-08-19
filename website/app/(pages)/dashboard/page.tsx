"use client";
import {
  addArtistToUser,
  getAllArtists,
  getGenreCount,
  getSpotifySearch,
  getUser,
} from "@/functions/api";
import { FollowerCount, GenreCount } from "@/components/counters";
import List, { ListAdd } from "@/components/List";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/components/interfaces";
import { navigate } from "@/functions/actions";
import SimpleCharts from "@/components/PieChart";
import { loadingElement } from "@/components/loading";
import SearchBar from "@/components/SearchBar";
import BottomBar from "@/components/bottombar";

export default function MyArtists() {
  /*
  TODO:
    - Do not keep calling api for every search query (for following component)
      - Keep track of a local list by calling getallartist api upon page load
      - When adding artist -> optimistic; change appropriate states and sets
    - Add Profile Pictures on Following 
      - Might have to add spotify url field onto names db table
    - Delete feature on Following 
  */

  const [genreCount, setGenreCount] = useState([]); // Sum of each genre (k-indie: 10, rap: 3, etc.)
  const [genreSum, setGenreSum] = useState(0); // Sum of all distinct genres

  // Keep track of all followed artists to mark already added artists in Add Artist component
  const [allUserArtists, setAllUserArtists] = useState<any>(new Set());

  // Search Result from Following Component
  const [searchResult, setSearchResult] = useState([]);
  const [artists, setArtists] = useState<any[]>([]);

  // Loading State
  const [loading, setLoading] = useState(true);

  // Set User for username
  const [user, setUser] = useState<User>();

  // Success Message
  const [addMsg, setAddMsg] = useState("");

  // Automatically hide state message after 15 seconds
  useEffect(() => {
    if (addMsg) {
      const timer = setTimeout(() => {
        setAddMsg("");
      }, 15000); //

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when addMsg changes
    }
  }, [addMsg]);

  useEffect(() => {
    async function init() {
      // Get User Info
      const user = await getUser();
      setUser(user);

      // Get all artists that user tracks
      const res = await getAllArtists();
      const sortedRes = res.sort(
        (a: { artist_name: string }, b: { artist_name: string }) =>
          a.artist_name.toLowerCase() > b.artist_name.toLowerCase() ? 1 : -1
      );
      setArtists(sortedRes);
      const artistIds = sortedRes.map(
        (artist: { artist_id: any }) => artist.artist_id
      );
      setAllUserArtists(new Set(artistIds));

      // Load Top 10 Genres that User Follows
      let genres = await getGenreCount();
      genres = genres["result"];
      const sortedGenres = genres.sort(
        (a: { value: number }, b: { value: number }) => b.value - a.value
      );
      setGenreSum(genres.length);
      const topGenres = sortedGenres.slice(0, Math.min(6, sortedGenres.length));
      setGenreCount(topGenres);

      // Stop loading here
      setLoading(false);
    }
    init();
  }, []);

  const searchFollowedArtists = async (data: any) => {
    setArtists(data);
  };

  const onClickArtist = async (artist_id: string, artist_name: string) => {
    sessionStorage.setItem(
      "redirectData",
      JSON.stringify({ artist_id: artist_id, artist_name: artist_name })
    );
    navigate(`/graph`);
  };

  const onSearchResult = async (data: any) => {
    setSearchResult(data);
  };

  const addArtist = async (
    artist_id: string,
    artist_name: string,
    followers: number,
    image_url: string,
    genres: string[]
  ) => {
    const res = await addArtistToUser(
      artist_id,
      artist_name,
      image_url,
      followers,
      genres
    );
    // console.log(res);
    if ("code" in res && res.code == 200) {
      setAddMsg(`${artist_name} was succesfully added.`);
    }

    // Create a new Set with the added artist_id
    const updatedUserArtists = new Set(allUserArtists);
    updatedUserArtists.add(artist_id);

    setAllUserArtists(updatedUserArtists);
    setArtists((artists) => [
      { artist_id: artist_id, artist_name: artist_name },
      ...artists,
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      {addMsg ? (
        <h1 className="absolute bg-green-600 p-3 pr-8 rounded-2xl top-2 right-2">
          {addMsg}
          <button
            onClick={() => setAddMsg("")}
            className="absolute top-1 right-1 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="red"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </h1>
      ) : (
        <></>
      )}
      <div className="flex flex-col xl:flex-row xl:max-w-[90%] w-full">
        <div className="hidden sm:block">
          <Sidebar
            username={user?.username || ""}
            currentPath={usePathname() ?? ""}
          />
        </div>
        {!loading ? (
          <div className="p-4 grid sm:grid-cols-8 gap-5 w-full">
            <section className="flex flex-col col-span-2 gap-5">
              <div className="grid grid-cols-2 sm:grid-cols-1 max:grid-cols-2 gap-3 justify-between">
                <FollowerCount
                  className="bg-blue-700"
                  count={allUserArtists.size}
                ></FollowerCount>
                <GenreCount
                  className="bg-green-700"
                  count={genreSum}
                ></GenreCount>
              </div>
              <div className="bg-orange-400 p-4 rounded-3xl">
                <h1>Top Genres</h1>
                <hr className="border-t-2 border-orange-200 my-2" />
                <SimpleCharts genres={genreCount}></SimpleCharts>
              </div>
            </section>

            <section className="col-span-3">
              <div className="flex flex-col bg-purple-700 p-4 rounded-3xl">
                <h1>Following</h1>
                <hr className="border-t-2 border-purple-500 my-2" />
                <SearchBar
                  onSearchResult={searchFollowedArtists}
                  spotify={false}
                ></SearchBar>
                <div className="mt-3">
                  <List
                    className="hover:bg-purple-500 rounded-lg"
                    onClickArtist={onClickArtist}
                    artists={artists}
                  ></List>
                </div>
              </div>
            </section>

            <section className="col-span-3">
              <div className="bg-red-500 p-4 rounded-3xl">
                <h1>Add Artist</h1>
                <hr className="border-t-2 border-red-300 my-2" />
                <SearchBar
                  onSearchResult={onSearchResult}
                  spotify={true}
                ></SearchBar>
                <div className="mt-3">
                  <ListAdd
                    artists={searchResult}
                    className="hover:bg-red-300 rounded-lg"
                    onClickArtist={addArtist}
                    artistSet={allUserArtists}
                  ></ListAdd>
                </div>
              </div>
            </section>
          </div>
        ) : (
          loadingElement
        )}
      </div>
      <BottomBar></BottomBar>
    </div>
  );
}
