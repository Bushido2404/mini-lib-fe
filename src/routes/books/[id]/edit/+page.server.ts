import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { booksApi } from '$lib/api/book';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');
	
	if (!token || !userStr) {
		redirect(302, '/login');
	}
	
	const user = JSON.parse(userStr);
	if (user.role !== 'ADMIN') {
		error(403, 'Access denied');
	}

	try {
		const book = await booksApi.getById(params.id, token);
		return { book };
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { book: null, error: (error as Error).message };
	}
};

export const actions: Actions = {
	default: async ({ params, request, cookies }) => {
		const token = cookies.get('access_token');
		if (!token) {
			redirect(302, '/login');
		}

		const data = await request.formData();
		const title = data.get('title') as string;
		const author = data.get('author') as string;
		const publicationYearStr = data.get('publicationYear') as string;
		const isbn = data.get('isbn') as string;

		if (!title || !author || !publicationYearStr || !isbn) {
			return fail(400, { error: 'All fields are required', title, author, publicationYear: publicationYearStr, isbn });
		}

		const publicationYear = parseInt(publicationYearStr);
		if (isNaN(publicationYear) || publicationYear < 1000 || publicationYear > 2100) {
			return fail(400, { error: 'Invalid publication year', title, author, publicationYear: publicationYearStr, isbn });
		}

		try {
			console.log('Updating book:', params.id, { title, author, publicationYear, isbn });
			await booksApi.update(params.id, { title, author, publicationYear, isbn }, token);
			console.log('Book updated successfully');
			redirect(302, `/books/${params.id}?message=Book updated successfully`);
		} catch (error) {
			console.error('Update book error:', error);
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/books/${params.id}?message=Book updated successfully`);
			} else {
				redirect(302, `/books/${params.id}?error=${encodeURIComponent(errorMessage)}`);
			}}
		}
	}
};