import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.set('access_token', '', {
			path: '/',
			maxAge: 0
		});
		cookies.set('user', '', {
			path: '/',
			maxAge: 0
		});
		redirect(302, '/login');
	}
};