import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loansApi } from '$lib/api/loan';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');
	
	if (!token || !userStr) {
		redirect(302, '/login');
	}

	try {
		const loans = await loansApi.getAll(token);
		return { loans };
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { loans: [], error: (error as Error).message };
	}
};