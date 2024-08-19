"use server";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { session_id, expires_at } = req.query;
  
  if (typeof session_id === "string" && typeof expires_at === "string") {
    // Set the cookie
    res.setHeader(
      "Set-Cookie",
      `session_id=${session_id}; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(
        expires_at
      ).toUTCString()}; Path=/`
    );
    
    // TODO: Add "secure;" back into ^^^^

    res.redirect(307, "/dashboard");

    // res.redirect(307, "/dashboard");
  } else {
    res.status(400).json({ error: "Missing access token or expiration" });
  }
}

