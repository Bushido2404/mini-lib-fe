import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('access_token');
	const userStr = cookies.get('user');

	// Allow access to login page without token
	if (url.pathname === '/login') {
		return { user: null };
	}

	// For books page, allow guest access
	if (url.pathname.startsWith('/books') && !token) {
		return { user: null };
	}

	if (!token || !userStr) {
		return { user: null };
	}

	try {
		const user = JSON.parse(userStr);
		return { user };
	} catch {
		return { user: null };
	}
};
