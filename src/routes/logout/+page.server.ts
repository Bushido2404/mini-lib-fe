import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete('access_token', { path: '/' });
		cookies.delete('user', { path: '/' });
		redirect(302, '/login');
	}
};