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
import { Allura } from "next/font/google";

export default function MyArtists() {
  const [genreCount, setGenreCount] = useState([]); // Sum of each genre (k-indie: 10, rap: 3, etc.)
  const [genreSum, setGenreSum] = useState(0); // Sum of all distinct genres

  // Keep track of all followed artists to mark already added artists in Add Artist component
  const [allUserArtists, setAllUserArtists] = useState<any>(new Set()); 

  // Search Result from Following Component
  const [searchResult, setSearchResult] = useState([]);
  const [artists, setArtists] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(true);
  
  // Set User for username
  const [user, setUser] = useState<User>();

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
      const artistIds = sortedRes.map((artist: { artist_id: any; }) => artist.artist_id);
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
  }

  const onClickArtist = async (artist_id: string, artist_name: string) => {
    sessionStorage.setItem(
      "redirectData",
      JSON.stringify({ artist_id: artist_id, artist_name: artist_name })
    );
    navigate(`/dashboard`);
  };

  const onSearchResult = async (data: any) => {
    setSearchResult(data);
  };

  const addArtist = async (artist_id: string, artist_name: string) => {
    addArtistToUser(artist_id, artist_name);
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="flex max-w-[90%] w-full">
        <div>
          <Sidebar
            username={user?.username || ""}
            currentPath={usePathname() ?? ""}
          />
        </div>
        {!loading ? (
          <div className="p-4 grid grid-cols-3 gap-5 w-full">
            <section className="flex flex-col gap-5">
              <div className="flex flex-row justify-center gap-5">
                <FollowerCount
                  className="bg-blue-700"
                  count={artists.length}
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
            <section className="">
              <div className="flex flex-col bg-purple-700 p-4 rounded-3xl">
                <h1>Following</h1>
                <hr className="border-t-2 border-purple-500 my-2"/>
                <SearchBar onSearchResult={searchFollowedArtists} spotify={false}></SearchBar>
                <div className="mt-3">
                  <List
                    className="hover:bg-purple-500 rounded-lg"
                    onClickArtist={onClickArtist}
                    artists={artists}
                  ></List>
                </div>
              </div>
            </section>
            <section className="">
              <div className="bg-red-500 p-4 rounded-3xl">
                <h1>Add Artist</h1>
                <hr className="border-t-2 border-red-300 my-2"/>
                <SearchBar onSearchResult={onSearchResult} spotify={true}></SearchBar>
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
    </div>
  );
}
