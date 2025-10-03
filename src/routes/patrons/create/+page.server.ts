import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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
		const email = data.get('email') as string;
		const phone = data.get('phone') as string;
		const address = data.get('address') as string;

		if (!firstName || !lastName || !email || !phone || !address) {
			return fail(400, { error: 'All fields are required', firstName, lastName, email, phone, address });
		}

		try {
			const patron = await patronsApi.create({ firstName, lastName, email, phone, address }, token);
			redirect(302, `/patrons/${patron.id}`);
		} catch (error) {
			return fail(500, { error: (error as Error).message, firstName, lastName, email, phone, address });
		}
	}
};