"use server";

export async function isAuthenticated(access_token: string) {
  const response = await fetch(process.env.API_ENDPOINT + "/auth/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include"
  });
  console.log(response)
  if (response.status == 200) {
    return true;
  }
  return false;
}
