"use client";

import { useState } from "react";
import { getSpotifySearch, searchArtists } from "@/functions/api";
// import { AnyNode } from "postcss";

function formatData(data: any) {
    // Get ID, Name, Follower, and Image
    const obj = data?.artists?.items;
    let artistList = [];
    for (let i = 0; i < obj.length; i++) {
        artistList.push({
            "artist_id": obj[i].id,
            "artist_name": obj[i].name,
            "followers": obj[i].followers.total,
            "image_url": obj[i].images[0]?.url ?? "/unknown.svg",
            "genres": obj[i]?.genres || []
        })
    }
    return artistList;
}

interface Prop {
    onSearchResult: (data: any) => void
    spotify: boolean
}

export default function SearchBarSpotify({onSearchResult, spotify}: Prop) {
  const [query, setQuery] = useState<string>("");

  const handleSearchResult = async (e: any) => {
    e.preventDefault();

    let data = [];
    if (spotify && query) {
        data = await getSpotifySearch(query);
        data = formatData(data);
        // console.log(data);
    }

    if (!spotify) {
        data = await searchArtists(query);
    }

    onSearchResult(data);
  };

  return (
    <form className="" onSubmit={handleSearchResult}>
      <label
        htmlFor="default-search"
        className="mb-2 text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full text-black text-lg p-4 ps-10 rounded-3xl bg-white"
          placeholder="Search Artists"
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
