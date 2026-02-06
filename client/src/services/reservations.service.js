import { apiRequest } from "./api.js";

export async function createReservation(payload) {
  const data = await apiRequest("/api/reservations", {
    method: "POST",
    body: payload,
  });
  return data.data;
}

export async function adminGetReservations() {
  const data = await apiRequest("/api/admin/reservations");
  return data.data || [];
}

export async function adminUpdateReservation(id, status) {
  const data = await apiRequest(`/api/admin/reservations/${id}`, {
    method: "PATCH",
    body: { status },
  });
  return data.data;
}
