export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	username: string;
	role: 'ADMIN' | 'USER';
	createdAt: string;
	updatedAt: string;
}

export interface UserFilters {
	name?: string;
	role?: string;
}

export interface CreateUserRequest extends Omit<User, '_id' | 'createdAt' | 'updatedAt'> {
	password: string;
}

export interface UpdateUserRequest extends Omit<User, '_id' | 'createdAt' | 'updatedAt'> {
	password?: string;
}