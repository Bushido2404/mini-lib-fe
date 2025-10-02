import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { patronsApi } from '$lib/api';

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
	} catch (err) {
		console.error('Failed to fetch patrons:', err);
		return { patrons: [] };
	}
};