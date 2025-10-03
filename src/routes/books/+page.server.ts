import type { PageServerLoad } from './$types';
import { booksApi } from '$lib/api/book';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');

	try {
		const books = await booksApi.getAll(token);
		return { books };
	} catch (error) {
		return { books: [], error: (error as Error).message };
	}
};
