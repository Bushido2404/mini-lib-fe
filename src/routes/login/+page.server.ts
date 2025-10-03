import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authApi } from '$lib/api/auth';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Username and password are required', username });
		}

		try {
			const response = await authApi.login({ username, password });

			cookies.set('access_token', response.access_token, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			cookies.set('user', JSON.stringify(response.user), {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});
		} catch (error) {
			let errorMessage = 'Invalid username or password';

			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			} else if (error && typeof error === 'object') {
				errorMessage = JSON.stringify(error);
			}

			return fail(401, { error: errorMessage, username });
		}

		redirect(302, '/books');
	}
};
