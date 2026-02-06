import { apiRequest } from "./api.js";

export async function getApprovedReviews() {
  const data = await apiRequest("/api/reviews");
  return data.data || [];
}

export async function createReview(payload) {
  const data = await apiRequest("/api/reviews", {
    method: "POST",
    body: payload,
  });
  return data.data;
}

export async function adminGetReviews() {
  const data = await apiRequest("/api/admin/reviews");
  return data.data || [];
}

export async function adminUpdateReview(id, status) {
  const data = await apiRequest(`/api/admin/reviews/${id}`, {
    method: "PATCH",
    body: { status },
  });
  return data.data;
}
