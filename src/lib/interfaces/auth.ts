export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	user: {
		_id: string;
		username: string;
		role: 'ADMIN' | 'USER';
		firstName: string;
		lastName: string;
	};
}