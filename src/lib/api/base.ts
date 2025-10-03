import { PUBLIC_API_URL } from '$env/static/public';

const API_BASE = PUBLIC_API_URL;

export async function apiCall(endpoint: string, options: RequestInit = {}, token?: string) {
	const headers: Record<string, string> = {
		...(options.headers as Record<string, string>)
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	if (options.body && typeof options.body === 'string') {
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers
	});

	if (response.status === 401) {
		// JWT expired or invalid
		throw new Error('Session expired');
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
