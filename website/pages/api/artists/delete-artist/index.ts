"use server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        artist_id,
        artist_name,
      }: { artist_id: string; artist_name: string } = req.body;
      console.log("test", artist_id);

      const response = await fetch(
        process.env.API_ENDPOINT + "/artists/remove-artist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
          body: JSON.stringify({
            artist_id: artist_id,
            artist_name: artist_name
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete artist from follower's list" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
