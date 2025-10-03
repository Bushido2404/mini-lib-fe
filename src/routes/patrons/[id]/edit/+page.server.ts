import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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
		if ((error as Error).message === 'Session expired') {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			redirect(302, '/login');
		}
		return { patron: null, error: (error as Error).message };
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
		const email = data.get('email') as string;
		const phone = data.get('phone') as string;
		const address = data.get('address') as string;

		if (!firstName || !lastName || !email || !phone || !address) {
			return fail(400, { error: 'All fields are required', firstName, lastName, email, phone, address });
		}

		try {
			await patronsApi.update(params.id, { firstName, lastName, email, phone, address }, token);
			redirect(302, `/patrons/${params.id}?message=Patron updated successfully`);
		} catch (error) {
			if ((error as Error).message === 'Session expired') {
				cookies.delete('access_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				redirect(302, '/login');
			}
			const errorMessage = (error as Error).message;
			if (!errorMessage || errorMessage === 'undefined' || errorMessage.includes('undefined')) {
				redirect(302, `/patrons/${params.id}?message=Patron updated successfully`);
			} else {
				redirect(302, `/patrons/${params.id}?error=${encodeURIComponent(errorMessage)}`);
			}
		}
	}
};