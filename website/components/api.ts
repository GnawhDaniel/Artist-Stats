export async function getSingleArtist(artist_id: string) {
  const response = await fetch(`/api/artists/${artist_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch artist");
  }
  return await response.json();
}

export async function searchArtists(query: string) {
  const response = await fetch(`/api/artists?query=${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    if (!response.ok) {
      throw new Error("Failed to fetch artists");
    }
  }
  return await response.json();
}

export async function getAllArtists() {
  const response = await fetch("/api/artists", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch artists");
  }
  return await response.json();
}

export async function getUser() {
  const response = await fetch("/api/auth/user/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info.");
  }
  const res = await response.json()
  return res;
}