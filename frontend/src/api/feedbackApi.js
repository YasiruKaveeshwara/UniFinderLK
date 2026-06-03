/**
 * feedbackApi.js
 * Frontend API service for feedback operations.
 */

const API_BASE = process.env.REACT_APP_BACKEND_URL;

/** Submit new feedback (public — works for guests and logged-in users). */
export async function createFeedback(payload) {
	const res = await fetch(`${API_BASE}/api/feedback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(payload),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to submit feedback");
	return data;
}

/** Get all public feedback (no email exposed). */
export async function getAllFeedback({ page = 1, limit = 20, section } = {}) {
	const params = new URLSearchParams({ page, limit });
	if (section) params.set("section", section);
	const res = await fetch(`${API_BASE}/api/feedback?${params}`, {
		credentials: "include",
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to fetch feedback");
	return data;
}

/** Get the current user's own feedback entries (protected). */
export async function getMyFeedback() {
	const res = await fetch(`${API_BASE}/api/feedback/mine`, {
		credentials: "include",
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to fetch your feedback");
	return data;
}

/** Edit own feedback within 7 days (protected). */
export async function updateFeedback(id, payload) {
	const res = await fetch(`${API_BASE}/api/feedback/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(payload),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to update feedback");
	return data;
}

/** Delete own feedback (protected). */
export async function deleteFeedback(id) {
	const res = await fetch(`${API_BASE}/api/feedback/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to delete feedback");
	return data;
}
