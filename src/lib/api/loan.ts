import { PUBLIC_API_URL } from '$env/static/public';
import type { Loan } from '$lib/interfaces';

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

export const loansApi = {
	getAll: (token: string): Promise<Loan[]> => apiCall('/loans', { method: 'GET' }, token),
	getById: (id: string, token: string): Promise<Loan> =>
		apiCall(`/loans/${id}`, { method: 'GET' }, token),
	create: (
		data: { bookId: string; patronId: string; borrowedDate: string },
		token: string
	): Promise<Loan> => apiCall('/loans', { method: 'POST', body: JSON.stringify(data) }, token),
	returnBook: (id: string, returnDate: string, token: string): Promise<Loan> =>
		apiCall(`/loans/${id}`, { method: 'PUT', body: JSON.stringify({ returnDate }) }, token),
	delete: (id: string, token: string): Promise<Loan> =>
		apiCall(`/loans/${id}`, { method: 'DELETE' }, token)
};

export const filterLoans = (
	loans: Loan[],
	filters: { book?: string; patron?: string; status?: string }
) => {
	return loans.filter((loan) => {
		if (filters.book && !loan.bookId.title.toLowerCase().includes(filters.book.toLowerCase())) {
			return false;
		}
		if (filters.patron) {
			const patronName = `${loan.patronId.firstName} ${loan.patronId.lastName}`.toLowerCase();
			if (!patronName.includes(filters.patron.toLowerCase())) {
				return false;
			}
		}
		if (filters.status) {
			const isReturned = !!loan.returnDate;
			if (filters.status === 'returned' && !isReturned) return false;
			if (filters.status === 'borrowed' && isReturned) return false;
		}
		return true;
	});
};