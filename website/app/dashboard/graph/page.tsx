"use client";
import Search from "@/components/search";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

// import { getAllArtists } from "@/components/search";

let test = [
  { date: "08-09-2024", followers: 123 },
  { date: "08-10-2024", followers: 1244 },
  { date: "08-11-2024", followers: 1255 },
  { date: "08-12-2024", followers: 1000 },
  { date: "08-13-2024", followers: null },
  { date: "08-14-2024", followers: 1100 },
];

export default function User() {
  const [data, setData] = useState([]);
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMax] = useState(0);
  const [artists, SetArtists] = useState([]);

  const handleSearchResult = (data: any) => {
    SetArtists(data);
  };

  const getArtist = async (artist_id: string) => {
    const response = await fetch(`http://localhost:8000/artists/${artist_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const res = await response.json();
    setData(res["data"]);
    setMinimum(res["min_followers"]);
    setMax(res["max_followers"]);
  };

  const graph = (
    <div className="min-h-screen">
      <LineChart width={1000} height={800} data={data}>
        <Line
          connectNulls
          type="monotone"
          dataKey="followers"
          stroke="#8884d8"
        />
        <XAxis dataKey="date" angle={45} minTickGap={-200} />
        <YAxis domain={[minimum, maximum]}></YAxis>
        <Legend wrapperStyle={{ position: "relative" }} />
        {/* <Tooltip /> */}
      </LineChart>
    </div>
  );

  return (
    <div>
      <h1>Welcome to the dashboard</h1>

      <Search onSearchResult={handleSearchResult}></Search>

      <div>
        <ul>
          {artists && artists.length > 0 ? <h1>Artist Results</h1> : null}
          {Array.isArray(artists) && artists.length > 0 ? (
            artists.map((artist, index) => (
              <div>
                <li key={index}>
                  <button onClick={() => getArtist(artist["artist_id"])}>
                    {artist["artist_name"]}
                  </button>
                </li>
              </div>
            ))
          ) : (
            <li>No artists available</li>
          )}
        </ul>
      </div>

      {data?.length > 0 ? graph : null}
    </div>
  );
}
