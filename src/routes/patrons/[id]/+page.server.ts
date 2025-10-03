import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
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
		return { patron: null, error: (error as Error).message };
	}
};