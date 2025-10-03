import { PUBLIC_API_URL } from '$env/static/public';
import type { User } from '$lib/interfaces';

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

export const usersApi = {
	getAll: (token: string): Promise<User[]> => apiCall('/users', { method: 'GET' }, token),
	getById: (id: string, token: string): Promise<User> =>
		apiCall(`/users/${id}`, { method: 'GET' }, token),
	create: (
		data: Omit<User, '_id' | 'createdAt' | 'updatedAt'> & { password: string },
		token: string
	): Promise<User> => apiCall('/users', { method: 'POST', body: JSON.stringify(data) }, token),
	update: (
		id: string,
		data: Omit<User, '_id' | 'createdAt' | 'updatedAt'> & { password?: string },
		token: string
	): Promise<User> => apiCall(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
	delete: (id: string, token: string): Promise<User> =>
		apiCall(`/users/${id}`, { method: 'DELETE' }, token)
};

export const filterUsers = (users: User[], filters: { name?: string; role?: string }) => {
	return users.filter((user) => {
		if (filters.name) {
			const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
			if (!fullName.includes(filters.name.toLowerCase())) {
				return false;
			}
		}
		if (filters.role && user.role !== filters.role) {
			return false;
		}
		return true;
	});
};