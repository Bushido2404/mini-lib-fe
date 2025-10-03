export interface Book {
	_id: string;
	title: string;
	author: string;
	publicationYear: number;
	isbn: string;
	coverPath?: string | null;
	coverUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface BookFilters {
	title?: string;
	author?: string;
	year?: string;
}
