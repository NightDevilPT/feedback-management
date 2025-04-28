import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../ui/pagination";

export interface PaginationProps {
	currentPage: number;
	totalPage: number;
	onPageChange: (page: number) => void;
}

const FMPaginationComponent: React.FC<PaginationProps> = ({
	currentPage,
	totalPage,
	onPageChange,
}) => {
	// Generate page numbers
	const pageNumbers = [];
	const maxVisiblePages = 5;

	if (totalPage <= maxVisiblePages) {
		for (let i = 1; i <= totalPage; i++) {
			pageNumbers.push(i);
		}
	} else {
		pageNumbers.push(1);
		const startPage = Math.max(2, currentPage - 1);
		const endPage = Math.min(totalPage - 1, currentPage + 1);

		if (startPage > 2) pageNumbers.push(-1);
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}
		if (endPage < totalPage - 1) pageNumbers.push(-2);
		pageNumbers.push(totalPage);
	}

	return (
		<Pagination className="mt-4">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() =>
							onPageChange(Math.max(1, currentPage - 1))
						}
						className={
							currentPage === 1
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>

				{pageNumbers.map((pageNum, index) =>
					pageNum < 0 ? (
						<PaginationItem key={`ellipsis-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={pageNum}>
							<PaginationLink
								isActive={pageNum === currentPage}
								onClick={() => onPageChange(pageNum)}
								className="cursor-pointer"
							>
								{pageNum}
							</PaginationLink>
						</PaginationItem>
					)
				)}

				<PaginationItem>
					<PaginationNext
						onClick={() =>
							onPageChange(Math.min(totalPage, currentPage + 1))
						}
						className={
							currentPage === totalPage
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default FMPaginationComponent;
