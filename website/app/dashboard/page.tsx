"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Search from "@/components/search";

// import { getAllArtists } from "@/components/search";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMax] = useState(0);
  const [artists, SetArtists] = useState([]);

  const handleSearchResult = (data: any) => {
    SetArtists(data);
  };

  useEffect(() => {
    // Function to be called once upon component load
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:8000/artists/5KOhn3Gjbd4DUavli5No5f",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const res = await response.json();
      setData(res["data"]);
      setMinimum(res["min_followers"]);
      setMax(res["max_followers"]);
      console.log(document.cookie);
    };

    fetchData(); // Call the function
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <h1>Welcome to the dashboard</h1>
      <Search onSearchResult={handleSearchResult}></Search>
      <div className="h-full w-full">
        <LineChart width={1000} height={800} data={data}>
          <Line type="monotone" dataKey="followers" stroke="#8884d8" />
          <XAxis dataKey="date" angle={45} minTickGap={-200} />
          <YAxis domain={[minimum, maximum]}></YAxis>
          <Legend wrapperStyle={{ position: "relative" }} />
          {/* <Tooltip /> */}
        </LineChart>

        {/* <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart> */}
      </div>
      <div>
        {/* <ul>
          {artists.map((artist, index) => (
            <li key={index}>{artist}</li> // Adjust based on your data structure
          ))}
        </ul> */}
      </div>
    </div>
  );
}
