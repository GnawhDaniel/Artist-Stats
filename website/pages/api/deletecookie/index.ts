import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Call Backend to delete cookie
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/google-auth/revoke-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        // Clear the cookie by setting it to expire in the past
        res.setHeader(
          "Set-Cookie",
          "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
        );

        // Set the status code to 307 (Temporary Redirect) and the Location header
        res.status(200).json({ message: "deleted cookie" });
      } else {
        res.status(400).json({ message: "could not delete cookie" });
      }
    } catch {}
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }
}
