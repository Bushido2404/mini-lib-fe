import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { booksApi } from '$lib/api';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	
	try {
		const book = await booksApi.getById(params.id, token);
		return { book };
	} catch (err) {
		error(404, 'Book not found');
	}
};