import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { loansApi } from '$lib/api/loan';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');
	
	if (!token || !userStr) {
		redirect(302, '/login');
	}

	try {
		const loan = await loansApi.getById(params.id, token);
		return { 
			loan,
			user: userStr ? JSON.parse(userStr) : null
		};
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { loan: null, error: (error as Error).message, user: null };
	}
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		const token = cookies.get('access_token');
		const userStr = cookies.get('user');
		
		if (!token || !userStr) {
			redirect(302, '/login');
		}
		
		const user = JSON.parse(userStr);
		if (user.role !== 'ADMIN') {
			return fail(403, { error: 'Access denied' });
		}

		try {
			await loansApi.delete(params.id, token);
			redirect(302, '/loans?message=Loan deleted successfully');
		} catch (error) {
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/loans?message=Loan deleted successfully`);
			} else {
				redirect(302, `/loans?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};