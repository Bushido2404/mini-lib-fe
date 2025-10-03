import { PUBLIC_API_URL } from '$env/static/public';
import type { Book } from '$lib/interfaces';
import { apiCall } from './base';

const API_BASE = PUBLIC_API_URL;

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

export const filterBooks = (
	books: Book[],
	filters: { title?: string; author?: string; year?: string }
) => {
	return books.filter((book) => {
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
