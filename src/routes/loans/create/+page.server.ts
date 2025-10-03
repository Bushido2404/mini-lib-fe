import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loansApi } from '$lib/api/loan';
import { booksApi } from '$lib/api/book';
import { patronsApi } from '$lib/api/patron';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');
	
	if (!token || !userStr) {
		redirect(302, '/login');
	}

	try {
		const [books, patrons] = await Promise.all([
			booksApi.getAll(token),
			patronsApi.getAll(token)
		]);
		return { books, patrons };
	} catch (error) {
		return { books: [], patrons: [], error: (error as Error).message };
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		if (!token) {
			redirect(302, '/login');
		}

		const data = await request.formData();
		const bookId = data.get('bookId') as string;
		const patronId = data.get('patronId') as string;
		const borrowedDate = data.get('borrowedDate') as string;

		if (!bookId || !patronId || !borrowedDate) {
			return fail(400, { error: 'All fields are required', bookId, patronId, borrowedDate });
		}

		try {
			const loan = await loansApi.create({ 
				bookId, 
				patronId, 
				borrowedDate: new Date(borrowedDate).toISOString() 
			}, token);
			redirect(302, `/loans/${loan.id}`);
		} catch (error) {
			return fail(500, { error: (error as Error).message, bookId, patronId, borrowedDate });
		}
	}
};