// src/app/actions/authActions.js

"use server";

export async function submitLoginForm(username: string, password: string) {
  //   Here you would typically make an API call to authenticate the user
  //   For example:
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(process.env.API_ENDPOINT + "/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
    credentials: 'include',
  });
  
  return {
    data: response.json(),
    status: response.status
  }
}
