/**
 * userApi.js
 * Frontend API service for user profile operations.
 * All requests include credentials for JWT cookie-based auth.
 */

const API_BASE = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch the authenticated user's profile.
 */
export async function fetchUserProfile() {
	const res = await fetch(`${API_BASE}/api/user/profile`, {
		credentials: "include",
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
	return data;
}

/**
 * Update the authenticated user's profile.
 * @param {{ name?: string, email?: string, password?: string }} updates
 */
export async function updateUserProfile(updates) {
	const res = await fetch(`${API_BASE}/api/user/profile`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(updates),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to update profile");
	return data;
}

/**
 * Delete the authenticated user's account.
 */
export async function deleteUserAccount() {
	const res = await fetch(`${API_BASE}/api/user/profile`, {
		method: "DELETE",
		credentials: "include",
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to delete account");
	return data;
}
