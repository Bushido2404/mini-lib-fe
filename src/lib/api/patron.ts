import type { Patron } from '$lib/interfaces';
import { apiCall } from './base';

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