const PROD_API_URL = "https://barcoronaapi.onrender.com";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const getToken = () => localStorage.getItem("coronahub_token");

export function getApiBaseUrl() {
  if (typeof window !== "undefined" && LOCAL_HOSTS.has(window.location.hostname)) {
    return "http://localhost:4000";
  }

  const runtimeOverride =
    typeof window !== "undefined" && typeof window.CORONAHUB_API_URL === "string"
      ? window.CORONAHUB_API_URL.trim()
      : "";

  if (runtimeOverride) {
    return runtimeOverride.replace(/\/+$/, "");
  }

  const buildOverride =
    typeof process !== "undefined" && typeof process.env?.API_URL === "string"
      ? process.env.API_URL.trim()
      : "";

  if (buildOverride) {
    return buildOverride.replace(/\/+$/, "");
  }

  return PROD_API_URL;
}

export async function apiRequest(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const fieldErrors = data?.errors?.fieldErrors;
    const firstFieldError = fieldErrors
      ? Object.values(fieldErrors).flat().find((item) => typeof item === "string" && item.trim())
      : null;
    const message = data.message || firstFieldError || "Error en la solicitud";
    throw new Error(message);
  }
  return data;
}

