import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authApi } from '$lib/api';

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

			redirect(302, '/books');
		} catch (error) {
			return fail(401, { error: `Invalid username or password: ${error}`, username });
		}
	}
};
