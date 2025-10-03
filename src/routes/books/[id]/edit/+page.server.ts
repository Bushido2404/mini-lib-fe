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
		const publicationYear = parseInt(data.get('publicationYear') as string);
		const isbn = data.get('isbn') as string;

		if (!title || !author || !publicationYear || !isbn) {
			return fail(400, { error: 'All fields are required', title, author, publicationYear, isbn });
		}

		try {
			await booksApi.update(params.id, { title, author, publicationYear, isbn }, token);
			redirect(302, `/books/${params.id}`);
		} catch (error) {
			return fail(500, { error: (error as Error).message, title, author, publicationYear, isbn });
		}
	}
};