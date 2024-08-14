export async function getSpotifySearch(query: string) {
  const response = await fetch(`/api/search?query=${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch artist from Spotify");
  }
  return await response.json();
}

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
  const res = await response.json();
  return res;
}

export async function getGenreCount() {
  const response = await fetch("/api/genres", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user's genres.");
  }
  const res = await response.json();
  return res;
}

export async function addArtistToUser(
  artist_id: string,
  artist_name: string,
  image_url: string = "",
  followers: number = -1,
) {
  const response = await fetch("/api/add-artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      artist_id: artist_id,
      artist_name: artist_name,
      image_url: image_url,
      followers: followers,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to add artist.");
  }
  const res = await response.json();
  return res;
}
