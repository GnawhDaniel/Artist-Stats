import type { NextApiRequest, NextApiResponse } from "next";

async function getAccessToken() {
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  });
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const access_token = await getAccessToken();

    const { query } = req.query;
    console.log("query", query, req)
    let apiURL = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=50&offset=0`;

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artists from Spotify" });
  }
}
