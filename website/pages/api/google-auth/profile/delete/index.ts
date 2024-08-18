import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/google-auth/delete-account`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      res.status(400).json({ message: "Could not complete delete request." });
    }

    res.setHeader(
      "Set-Cookie",
      "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
