/**
 * academicApi.js
 * Frontend API service for academic profile operations (OL/AL subjects).
 * All requests include credentials for JWT cookie-based auth.
 */

const API_BASE = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch the authenticated user's academic profile.
 */
export async function fetchAcademicProfile() {
	const res = await fetch(`${API_BASE}/api/academic/profile`, {
		credentials: "include",
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to fetch academic profile");
	return data;
}

/**
 * Save/update the user's O/L subject data.
 * @param {{ core: object, bucket_1?: string, bucket_2?: string, bucket_3?: string }} olData
 */
export async function saveOLSubjects(olData) {
	const res = await fetch(`${API_BASE}/api/academic/ol-subjects`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(olData),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to save O/L subjects");
	return data;
}

/**
 * Save/update the user's A/L subject data.
 * @param {{ stream?: string, subjects?: string[], district?: string, zscore?: number, interests?: string }} alData
 */
export async function saveALSubjects(alData) {
	const res = await fetch(`${API_BASE}/api/academic/al-subjects`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(alData),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || "Failed to save A/L subjects");
	return data;
}
