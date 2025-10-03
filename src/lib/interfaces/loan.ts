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

export interface LoanFilters {
	book?: string;
	patron?: string;
	status?: string;
}

export interface CreateLoanRequest {
	bookId: string;
	patronId: string;
	borrowedDate: string;
}

export interface ReturnLoanRequest {
	returnDate: string;
}