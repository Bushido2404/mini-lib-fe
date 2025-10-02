import { PUBLIC_API_URL } from '$env/static/public';
import {
	type LoginRequest,
	type LoginResponse,
	type User,
	type Patron,
	type Book,
	type Loan
} from '$lib/interfaces/interface';
const API_BASE = PUBLIC_API_URL;

async function apiCall(endpoint: string, options: RequestInit = {}, token?: string) {
	const headers: Record<string, string> = {
		...(options.headers as Record<string, string>)
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	// Only add Content-Type for JSON requests
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

// Auth API
export const authApi = {
	login: (data: LoginRequest): Promise<LoginResponse> =>
		apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) })
};

// Users API
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

// Books API
export const booksApi = {
	getAll: (token?: string): Promise<Book[]> => apiCall('/books', { method: 'GET' }, token),
	getById: (id: string, token?: string): Promise<Book> =>
		apiCall(`/books/${id}`, { method: 'GET' }, token),
	create: (
		data: Omit<Book, '_id' | 'coverPath' | 'createdAt' | 'updatedAt'>,
		token: string
	): Promise<Book> => apiCall('/books', { method: 'POST', body: JSON.stringify(data) }, token),
	update: (
		id: string,
		data: Omit<Book, '_id' | 'coverPath' | 'createdAt' | 'updatedAt'>,
		token: string
	): Promise<Book> => apiCall(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
	delete: (id: string, token: string): Promise<Book> =>
		apiCall(`/books/${id}`, { method: 'DELETE' }, token),
	uploadCover: async (
		id: string,
		file: File,
		token: string
	): Promise<{ message: string; coverPath: string }> => {
		const formData = new FormData();
		formData.append('cover', file);
		const response = await fetch(`${API_BASE}/books/${id}/cover`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${token}` },
			body: formData
		});
		if (!response.ok) {
			throw new Error('Failed to upload cover');
		}
		return response.json();
	},
	downloadCover: (id: string, token?: string): string => {
		const url = `${API_BASE}/books/${id}/download-cover`;
		return token ? `${url}?token=${token}` : url;
	}
};

// Patrons API
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

// Loans API
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

// Client-side filtering utilities
export const filterBooks = (
	books: Book[],
	filters: { title?: string; author?: string; year?: string }
) => {
	return books.filter((book) => {
		console.log(filters, book.publicationYear.toString());
		if (filters.title && !book.title.toLowerCase().includes(filters.title.toLowerCase())) {
			return false;
		}
		if (filters.author && !book.author.toLowerCase().includes(filters.author.toLowerCase())) {
			return false;
		}
		if (filters.year && book.publicationYear.toString() !== filters.year) {
			return false;
		}
		return true;
	});
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
