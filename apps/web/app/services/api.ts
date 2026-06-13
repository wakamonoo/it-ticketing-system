const API_URL = "http://localhost:5000";

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("api error:", data);
    throw new Error(data.error || "request failed");
  }

  return data;
}
