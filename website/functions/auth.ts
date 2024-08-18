"use server";

export async function isAuthenticatedGoogle(session_id: string | undefined) {
  if (session_id === undefined) {
    return false;
  }
  const response = await fetch(
    process.env.API_ENDPOINT + "/google-auth/authenticated",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id }) // Sending session ID in the request body
    }
  );

  if (response.status == 200) {
    const res = await response.json();
    return res["authenticated"];
  }
  return false;
}

// export async function isAuthenticated(access_token: string | undefined) {
//   if (access_token === undefined)
//   {
//     return false;
//   }

//   const response = await fetch(process.env.API_ENDPOINT + "/auth/users/me", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${access_token}`,
//     },
//     credentials: "include"
//   });
//   if (response.status == 200) {
//     return true;
//   }
//   return false;
// }
