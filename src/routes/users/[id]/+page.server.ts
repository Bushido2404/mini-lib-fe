import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { usersApi } from '$lib/api';

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
	} catch (err) {
		error(404, 'User not found');
	}
};