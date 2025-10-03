import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { usersApi } from '$lib/api/user';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');
	
	if (!token || !userStr) {
		redirect(302, '/login');
	}
	
	const currentUser = JSON.parse(userStr);
	if (currentUser.role !== 'ADMIN') {
		error(403, 'Access denied');
	}

	try {
		const user = await usersApi.getById(params.id, token);
		return { user };
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { user: null, error: (error as Error).message };
	}
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		const token = cookies.get('access_token');
		if (!token) {
			redirect(302, '/login');
		}

		try {
			await usersApi.delete(params.id, token);
			redirect(302, '/users?message=User deleted successfully');
		} catch (error) {
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/users?message=User deleted successfully`);
			} else {
				redirect(302, `/users?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};