import { PUBLIC_API_URL } from '$env/static/public';
import type { LoginRequest, LoginResponse } from '$lib/interfaces';

const API_BASE = PUBLIC_API_URL;

async function apiCall(endpoint: string, options: RequestInit = {}) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	try {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			...options,
			headers
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.log('API Error data:', errorData);
			throw new Error(
				errorData.message || `Login failed: ${response.status} ${response.statusText}`
			);
		}

		const result = await response.json();
		console.log('API Success result:', result);
		return result;
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error('Cannot connect to server.');
		}
		throw error;
	}
}

export const authApi = {
	login: (data: LoginRequest): Promise<LoginResponse> =>
		apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) })
};
