import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { usersApi } from '$lib/api';

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
		const users = await usersApi.getAll(token);
		return { users };
	} catch (err) {
		console.error('Failed to fetch users:', err);
		return { users: [] };
	}
};