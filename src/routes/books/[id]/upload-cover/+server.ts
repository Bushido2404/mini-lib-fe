import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { booksApi } from '$lib/api';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	const token = cookies.get('access_token');
	if (!token) {
		error(401, 'Unauthorized');
	}

	try {
		const formData = await request.formData();
		const file = formData.get('cover') as File;
		
		if (!file) {
			error(400, 'No file provided');
		}

		const book = await booksApi.uploadCover(params.id, file, token);
		return json(book);
	} catch (err) {
		error(500, 'Failed to upload cover');
	}
};