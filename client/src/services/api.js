const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getToken = () => localStorage.getItem("coronahub_token");

export async function apiRequest(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const message = data.message || "Error en la solicitud";
    throw new Error(message);
  }
  return data;
}
