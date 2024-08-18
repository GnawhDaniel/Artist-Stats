import type { NextApiRequest, NextApiResponse } from "next";
import { list } from "postcss";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/google-auth/change-username`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "", 
        },      
        credentials: "include",
        body: JSON.stringify(req.body), // Forward the request body
      }
    );
    if (!response.ok) {
        let errorMsg = await response.json();
        errorMsg = errorMsg?.detail || ""
        if (Array.isArray(errorMsg)) {
            errorMsg = "Invalid username"
        }
        res.status(response.status).json({"message": errorMsg});
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}