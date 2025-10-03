import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { booksApi } from '$lib/api/book';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');

	try {
		const book = await booksApi.getById(params.id, token);
		// Add coverUrl if coverPath exists
		if (book.coverPath) {
			book.coverUrl = booksApi.downloadCover(params.id, token);
		}
		return {
			book,
			user: userStr ? JSON.parse(userStr) : null
		};
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { book: null, error: (error as Error).message, user: null };
	}
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		const token = cookies.get('access_token');
		const userStr = cookies.get('user');

		if (!token || !userStr) {
			redirect(302, '/login');
		}

		try {
			const user = JSON.parse(userStr);
			if (user.role !== 'ADMIN') {
				return fail(403, { error: 'Access denied' });
			}
		} catch (parseError) {
			console.error('User parse error:', parseError);
			redirect(302, '/login');
		}

		try {
			console.log('Attempting to delete book:', params.id);
			await booksApi.delete(params.id, token);
			console.log('Book deleted successfully');
			redirect(302, '/books?message=Book deleted successfully');
		} catch (error) {
			console.error('Delete book error:', error);
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/books?message=Book deleted successfully`);
			} else {
				redirect(302, `/books?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};
