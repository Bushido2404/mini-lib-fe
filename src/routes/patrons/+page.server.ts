import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { patronsApi } from '$lib/api/patron';

export const load: PageServerLoad = async ({ cookies }) => {
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
		const patrons = await patronsApi.getAll(token);
		return { patrons };
	} catch (error) {
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { patrons: [], error: (error as Error).message };
	}
};