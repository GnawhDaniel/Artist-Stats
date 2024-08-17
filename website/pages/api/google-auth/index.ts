import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiURL = process.env.API_ENDPOINT;
  const response = await fetch(
    `${process.env.API_ENDPOINT}/google-auth/authenticate`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "", 
      },      
      credentials: "include",
    }
  );
  const data = await response.json();
  res.status(200).json(data);

}
