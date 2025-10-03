import { PUBLIC_API_URL } from '$env/static/public';
import type { Patron } from '$lib/interfaces';

const API_BASE = PUBLIC_API_URL;

async function apiCall(endpoint: string, options: RequestInit = {}, token?: string) {
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

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export const patronsApi = {
	getAll: (token: string): Promise<Patron[]> => apiCall('/patrons', { method: 'GET' }, token),
	getById: (id: string, token: string): Promise<Patron> =>
		apiCall(`/patrons/${id}`, { method: 'GET' }, token),
	create: (data: Omit<Patron, '_id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Patron> =>
		apiCall('/patrons', { method: 'POST', body: JSON.stringify(data) }, token),
	update: (
		id: string,
		data: Omit<Patron, '_id' | 'createdAt' | 'updatedAt'>,
		token: string
	): Promise<Patron> =>
		apiCall(`/patrons/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
	delete: (id: string, token: string): Promise<Patron> =>
		apiCall(`/patrons/${id}`, { method: 'DELETE' }, token)
};

export const filterPatrons = (patrons: Patron[], filters: { name?: string; email?: string }) => {
	return patrons.filter((patron) => {
		if (filters.name) {
			const fullName = `${patron.firstName} ${patron.lastName}`.toLowerCase();
			if (!fullName.includes(filters.name.toLowerCase())) {
				return false;
			}
		}
		if (filters.email && !patron.email.toLowerCase().includes(filters.email.toLowerCase())) {
			return false;
		}
		return true;
	});
};