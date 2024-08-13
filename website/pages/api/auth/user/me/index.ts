import type { NextApiRequest, NextApiResponse } from "next";

function getCookieValue(cookie: string, cookieName: string): string | null {
    const cookies = cookie.split('; ').map(c => c.split('='));
    const cookieObj = Object.fromEntries(cookies);
    return cookieObj[cookieName] || null;
  }
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookieString = req.headers.cookie ?? "";
    const sessionID = getCookieValue(cookieString, "session_id");

    const response = await fetch(process.env.API_ENDPOINT + "/auth/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionID}`,
        },
        credentials: "include"
      });

    const data = await response.json();
    console.log("Res", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
}

