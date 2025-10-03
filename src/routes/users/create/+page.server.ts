import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { usersApi } from '$lib/api/user';

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
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		if (!token) {
			redirect(302, '/login');
		}

		const data = await request.formData();
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const role = data.get('role') as 'ADMIN' | 'USER';

		if (!firstName || !lastName || !username || !password || !role) {
			return fail(400, { error: 'All fields are required', firstName, lastName, username, role });
		}

		try {
			const user = await usersApi.create({ firstName, lastName, username, password, role }, token);
			redirect(302, `/users/${user.id}`);
		} catch (error) {
			return fail(500, { error: (error as Error).message, firstName, lastName, username, role });
		}
	}
};