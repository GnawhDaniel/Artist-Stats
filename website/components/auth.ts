"use server";

export async function isAuthenticated(access_token: string) {
  const response = await fetch(process.env.API_ENDPOINT + "/auth/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorizaion: `Bearer ${access_token}`,
    },
  });

  return response.json();
}
