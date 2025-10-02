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

export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	username: string;
	role: 'ADMIN' | 'USER';
	createdAt: string;
	updatedAt: string;
}

export interface Book {
	_id: string;
	title: string;
	author: string;
	publicationYear: number;
	isbn: string;
	coverPath?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Patron {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
}

export interface Loan {
	_id: string;
	bookId: {
		_id: string;
		title: string;
		author: string;
		publicationYear: number;
		isbn: string;
	};
	patronId: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	borrowedDate: string;
	returnDate?: string | null;
	createdAt: string;
	updatedAt: string;
}
