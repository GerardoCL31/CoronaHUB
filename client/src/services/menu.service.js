import { apiRequest } from "./api.js";

export async function adminGetMenu() {
  const data = await apiRequest("/api/admin/menu");
  return data.data;
}

export async function adminUpdateMenu(payload) {
  const data = await apiRequest("/api/admin/menu", {
    method: "PUT",
    body: payload,
  });
  return data.data;
}
