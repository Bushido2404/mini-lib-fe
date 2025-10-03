import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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
		return { user: null, error: (error as Error).message };
	}
};

export const actions: Actions = {
	default: async ({ params, request, cookies }) => {
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

		if (!firstName || !lastName || !username || !role) {
			return fail(400, { error: 'All fields except password are required', firstName, lastName, username, role });
		}

		try {
			const updateData: any = { firstName, lastName, username, role };
			if (password) {
				updateData.password = password;
			}
			
			await usersApi.update(params.id, updateData, token);
			redirect(302, `/users/${params.id}`);
		} catch (error) {
			return fail(500, { error: (error as Error).message, firstName, lastName, username, role });
		}
	}
};