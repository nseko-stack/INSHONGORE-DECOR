
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getCurrentAdmin() {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.admin;
  } catch (error) {
    console.error(
      "Failed to check admin authentication:",
      error
    );

    return null;
  }
}

