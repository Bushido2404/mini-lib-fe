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
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
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
		const borrowedDateStr = data.get('borrowedDate') as string;

		if (!bookId || !patronId || !borrowedDateStr) {
			return fail(400, { error: 'All fields are required', bookId, patronId, borrowedDate: borrowedDateStr });
		}

		// Validate date
		const borrowedDate = new Date(borrowedDateStr);
		if (isNaN(borrowedDate.getTime())) {
			return fail(400, { error: 'Invalid date format', bookId, patronId, borrowedDate: borrowedDateStr });
		}

		try {
			const loan = await loansApi.create({ 
				bookId, 
				patronId, 
				borrowedDate: borrowedDate.toISOString() 
			}, token);
			if (loan && loan._id) {
				redirect(302, `/loans/${loan._id}?message=Loan created successfully`);
			} else {
				redirect(302, `/loans?message=Loan created successfully`);
			}
		} catch (error) {
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/loans?message=Loan created successfully`);
			} else {
				redirect(302, `/loans?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};