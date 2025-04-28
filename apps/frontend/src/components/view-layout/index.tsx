import React, { useState } from "react";
import { Button } from "../ui/button";
import { LayoutGrid, Table, TableIcon } from "lucide-react";
import { Pagination } from "../ui/pagination";
import FMPaginationComponent from "../molecules/fm-pagination";
import { useAuth } from "@/src/provider/auth-provider";

interface DataViewProps<T> {
	data: T[];
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	totalPage: number;
	onPageChange: (page: number) => void;
	tableView: React.ReactNode;
	gridView: React.ReactNode;
	isLoading?: boolean;
	error?: string | null;
	defaultView?: "table" | "grid";
}

export function DataView<T>({
	data,
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
	tableView,
	totalPage,
	gridView,
	isLoading = false,
	error = null,
	defaultView = "table",
}: DataViewProps<T>) {
	const { view, setView } = useAuth();

	if (isLoading) {
		return <div className="flex justify-center p-8">Loading...</div>;
	}

	if (error) {
		return <div className="text-red-500 p-4 text-center">{error}</div>;
	}

	if (!data || data.length === 0) {
		return (
			<div className="text-gray-500 p-4 text-center">
				No data available
			</div>
		);
	}

	return (
		<div className="space-y-4 w-full overflow-auto">
			<div className="flex justify-end items-center w-full">
				<div className="flex space-x-2">
					<Button
						variant={view === "table" ? "outline" : "ghost"}
						size="sm"
						onClick={() => setView("table")}
						aria-label="Table view"
					>
						<TableIcon className="w-4 h-4" />
					</Button>
					<Button
						variant={view === "grid" ? "outline" : "ghost"}
						size="sm"
						onClick={() => setView("grid")}
						aria-label="Grid view"
					>
						<LayoutGrid className="w-4 h-4" />
					</Button>
					
				</div>
			</div>

			<div
				className={`w-full overflow-auto`}
			>
				{view === "table" ? tableView : gridView}
			</div>
			<div className="text-sm text-gray-500">
				Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
				{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
				{totalItems} items
			</div>

			{totalItems > itemsPerPage && (
				<div className="flex justify-center mt-6">
					<FMPaginationComponent
						currentPage={currentPage}
						totalPage={totalPage}
						onPageChange={onPageChange}
					/>
				</div>
			)}
		</div>
	);
}
