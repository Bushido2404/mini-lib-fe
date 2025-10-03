import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { patronsApi } from '$lib/api/patron';

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
		const patron = await patronsApi.getById(params.id, token);
		return { patron };
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { patron: null, error: (error as Error).message };
	}
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		const token = cookies.get('access_token');
		if (!token) {
			redirect(302, '/login');
		}

		try {
			await patronsApi.delete(params.id, token);
			redirect(302, '/patrons?message=Patron deleted successfully');
		} catch (error) {
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/patrons?message=Patron deleted successfully`);
			} else {
				redirect(302, `/patrons?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};