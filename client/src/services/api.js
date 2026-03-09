const PROD_API_URL = "https://barcoronaapi.onrender.com";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
const PRIVATE_IPV4_REGEX = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;
const DEV_PORTS = new Set(["5173", "5174"]);

const getToken = () => localStorage.getItem("coronahub_token");

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const { hostname, protocol, port } = window.location;
    const isMachineHost = !hostname.includes(".") && !/^\d+$/.test(hostname);
    const isLocalLikeHost =
      LOCAL_HOSTS.has(hostname) ||
      PRIVATE_IPV4_REGEX.test(hostname) ||
      hostname.endsWith(".local") ||
      isMachineHost;
    const isDevPort = DEV_PORTS.has(port);

    if (isLocalLikeHost || isDevPort) {
      return `${protocol}//${hostname}:4000`;
    }
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
  const baseUrl = getApiBaseUrl();
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor (${baseUrl})`);
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

