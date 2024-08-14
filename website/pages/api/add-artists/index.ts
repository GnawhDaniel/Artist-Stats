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
      console.log(artist_id, artist_name, image_url, followers)
      // Here you would typically:
      // 1. Validate the input
      // 2. Connect to your database
      // 3. Add the artist to the database
      // 4. Handle any errors that might occur

      // For this example, we'll just echo back the received data
      res
        .status(200)
        .json({
          message: "Artist added successfully",
          artist: { artist_id, artist_name, image_url, followers },
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding artist", error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
