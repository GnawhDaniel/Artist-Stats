"use server";

export async function isAuthenticated(access_token: string | undefined) {
  if (access_token === undefined)
  {
    return false;
  }

  const response = await fetch(process.env.API_ENDPOINT + "/auth/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include"
  });
  if (response.status == 200) {
    return true;
  }
  return false;
}
