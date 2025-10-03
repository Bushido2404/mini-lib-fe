import type { PageServerLoad } from './$types';
import { booksApi } from '$lib/api/book';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');

	try {
		const book = await booksApi.getById(params.id, token);
		return { book };
	} catch (error) {
		return { book: null, error: (error as Error).message };
	}
};
