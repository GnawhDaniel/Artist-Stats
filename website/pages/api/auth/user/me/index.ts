import type { NextApiRequest, NextApiResponse } from "next";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Cookie", req.headers.cookie)
    const response = await fetch(process.env.API_ENDPOINT + "/google-auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        credentials: "include"
      });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
}

