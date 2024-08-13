import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiURL = process.env.API_ENDPOINT;
  try {
    const response = await fetch(`${apiURL}/artists/getgenrecount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "", 
      },
      credentials: "include",
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's genres" });
  }
}