import type { NextApiRequest, NextApiResponse } from "next";

type Artist = {
  artist_id: string;
  artist_name: string;
  image_url: string;
  followers: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { artist_id, artist_name, image_url, followers }: Artist = req.body;
      console.log(req.body);
      const response = await fetch(
        process.env.API_ENDPOINT + "/artists/add-artist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
          body: JSON.stringify({
            "artist_id": artist_id,
            "artist_name": artist_name,
            "image_url": image_url,
            "followers": followers,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add artist");
      }

      const data = await response.json();
      console.log(response);

      res.status(200).json(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error adding artist", error: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
