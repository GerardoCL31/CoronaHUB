import { apiRequest } from "./api.js";

const TOKEN_KEY = "coronahub_token";

export async function login(email, password) {
  const data = await apiRequest("/api/admin/login", {
    method: "POST",
    body: { email, password },
  });
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
