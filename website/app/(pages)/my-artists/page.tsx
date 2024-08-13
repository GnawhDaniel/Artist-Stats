"use client";
import {
  getAllArtists,
  getGenreCount,
  getSpotifySearch,
  getUser,
} from "@/functions/api";
import FollowerCount from "@/components/followerCount";
import List from "@/components/List";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/components/interfaces";
import { navigate } from "@/functions/actions";
import SimpleCharts from "@/components/PieChart";
import { loadingElement } from "@/components/loading";

export default function MyArtists() {
  const [genreCount, setGenreCount] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
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

      // Load Top 10 Genres that User Follows
      let genres = await getGenreCount();
      genres = genres["result"];
      const sortedGenres = genres.sort(
        (a: { value: number }, b: { value: number }) => b.value - a.value
      );
      const topGenres = sortedGenres.slice(
        0,
        Math.min(6, sortedGenres.length)
      );
      setGenreCount(topGenres);

      // Stop loading here
      setLoading(false);
    }
    init();
  }, []);

  const onClickArtist = async (artist_id: string, artist_name: string) => {
    sessionStorage.setItem(
      "redirectData",
      JSON.stringify({ artist_id: artist_id, artist_name: artist_name })
    );
    navigate(`/dashboard`);
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
          <div className="p-4 flex gap-5 w-full">
            <section className="">
              <div>
                <FollowerCount
                  className="bg-blue-700"
                  followerCount={artists.length}
                ></FollowerCount>
              </div>
            </section>
            <section className="">
              <div className="bg-orange-400 p-4 rounded-3xl">
              <h1>Top Genres</h1>
              <hr className="border-t-2 border-orange-200 my-2" />
                <SimpleCharts genres={genreCount}></SimpleCharts>
              </div>
            </section>
            <section className="">
              <div className="flex flex-col bg-purple-700 p-4 rounded-3xl">
                <h1>Following</h1>
                <hr className="border-t-2 border-purple-500 my-2" />
                <List
                  className="hover:bg-purple-500 rounded-lg"
                  onClickArtist={onClickArtist}
                  artists={artists}
                ></List>
              </div>
            </section>
            <section className="">
              <div className="bg-red-500 p-4 rounded-3xl">
              <h1>Add Artist</h1>
              <hr className="border-t-2 border-red-300 my-2" />

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
