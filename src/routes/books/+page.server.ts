import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { booksApi } from '$lib/api/book';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');

	try {
		const books = await booksApi.getAll(token);
		// Add coverUrl for books that have coverPath
		books.forEach(book => {
			if (book.coverPath) {
				book.coverUrl = booksApi.downloadCover(book._id, token);
			}
		});
		return { 
			books,
			user: userStr ? JSON.parse(userStr) : null
		};
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { books: [], error: (error as Error).message, user: null };
	}
};
