import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiURL = process.env.API_ENDPOINT;
  const response = await fetch(
    `https://5100-2607-fb90-d596-9474-a5eb-7baf-187d-e272.ngrok-free.app/google-auth/authenticate`,
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
