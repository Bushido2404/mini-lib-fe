import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loansApi } from '$lib/api/loan';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');
	
	if (!token || !userStr) {
		redirect(302, '/login');
	}

	try {
		const loan = await loansApi.getById(params.id, token);
		return { loan };
	} catch (error) {
		return { loan: null, error: (error as Error).message };
	}
};