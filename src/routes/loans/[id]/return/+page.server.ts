import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loansApi } from '$lib/api/loan';

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
		const loan = await loansApi.getById(params.id, token);
		if (loan.returnDate) {
			redirect(302, `/loans/${params.id}`);
		}
		return { loan };
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { loan: null, error: (error as Error).message };
	}
};

export const actions: Actions = {
	default: async ({ params, request, cookies }) => {
		const token = cookies.get('access_token');
		if (!token) {
			redirect(302, '/login');
		}

		const data = await request.formData();
		const returnDate = data.get('returnDate') as string;

		if (!returnDate) {
			return fail(400, { error: 'Return date is required', returnDate });
		}

		try {
			await loansApi.returnBook(params.id, new Date(returnDate).toISOString(), token);
			redirect(302, `/loans/${params.id}?message=Book returned successfully`);
		} catch (error) {
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/loans/${params.id}?message=Book returned successfully`);
			} else {
				redirect(302, `/loans/${params.id}/return?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};