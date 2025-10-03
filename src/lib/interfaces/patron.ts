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

export interface PatronFilters {
	name?: string;
	email?: string;
}

export interface CreatePatronRequest extends Omit<Patron, '_id' | 'createdAt' | 'updatedAt'> {}

export interface UpdatePatronRequest extends Omit<Patron, '_id' | 'createdAt' | 'updatedAt'> {}