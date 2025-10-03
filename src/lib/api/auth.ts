import type { LoginRequest, LoginResponse } from '$lib/interfaces';
import { apiCall } from './base';
export const authApi = {
	login: (data: LoginRequest): Promise<LoginResponse> =>
		apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) })
};
