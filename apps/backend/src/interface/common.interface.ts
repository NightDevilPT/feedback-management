export interface PaginationMeta {
	totalItems: number;
	itemCount: number;
	itemsPerPage: number;
	totalPages: number;
	currentPage: number;
}

export interface PaginatedResponse<T> {
	status: "success" | "error";
	message?: string;
	data: T[];
	meta: PaginationMeta;
}
