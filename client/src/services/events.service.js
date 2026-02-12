import { apiRequest } from "./api.js";

export async function getEvents() {
  const data = await apiRequest("/api/events");
  return data.data;
}

export async function adminGetEvents() {
  const data = await apiRequest("/api/admin/events");
  return data.data;
}

export async function adminUpdateEvents(payload) {
  const data = await apiRequest("/api/admin/events", {
    method: "PUT",
    body: payload,
  });
  return data.data;
}
