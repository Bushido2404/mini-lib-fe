import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loansApi } from '$lib/api';

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
	} catch (err) {
		error(404, 'Loan not found');
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
			redirect(302, `/loans/${params.id}`);
		} catch (err) {
			return fail(500, { error: 'Failed to return book', returnDate });
		}
	}
};