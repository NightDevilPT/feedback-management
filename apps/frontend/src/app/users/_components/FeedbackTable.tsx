"use client";

import FMTable, { ColumnConfig } from "@/src/components/molecules/fm-table";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { FeedbackResponse } from "@/src/interface/feedback.interface";
import {
	FeedbackCategory,
	FeedbackStatus,
} from "@/src/interface/feedback.interface";
import { useAuth } from "@/src/provider/auth-provider";
import { Edit, Star } from "lucide-react";

interface FeedbackTableProps {
	data: FeedbackResponse[];
	id: string;
	onEdit?: (feedback: FeedbackResponse) => void;
}

const FeedbackTable = ({ data, id, onEdit }: FeedbackTableProps) => {
	const { user } = useAuth();
	const feedbackColumns: ColumnConfig<FeedbackResponse>[] = [
		{
			field: "rating",
			headerName: "Rating",
			sortable: true,
			width: "120px",
			renderCell: (feedback) => (
				<div className="flex items-center gap-1">
					<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
					<span>{feedback.rating}/5</span>
				</div>
			),
		},
		{
			field: "comment",
			headerName: "Feedback",
			sortable: true,
			width: "200px",
			renderCell: (feedback) => (
				<div className="line-clamp-2 truncate">
					<Label>{feedback.comment}</Label>
				</div>
			),
		},
		{
			field: "category",
			headerName: "Category",
			sortable: true,
			width: "150px",
			renderCell: (feedback) => (
				<span
					className={`px-2 py-1 text-xs rounded-full ${
						feedback.category === FeedbackCategory.BUG
							? "bg-red-100 text-red-800"
							: feedback.category === FeedbackCategory.FEATURE
							? "bg-blue-100 text-blue-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{feedback.category}
				</span>
			),
		},
		{
			field: "status",
			headerName: "Status",
			sortable: true,
			width: "120px",
			renderCell: (feedback) => (
				<span
					className={`px-2 py-1 text-xs rounded-full ${
						feedback.status === FeedbackStatus.OPEN
							? "bg-yellow-100 text-yellow-800"
							: feedback.status === FeedbackStatus.IN_PROGRESS
							? "bg-blue-100 text-blue-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{feedback.status}
				</span>
			),
		},
		{
			field: "raisedBy",
			headerName: "Raised By",
			sortable: true,
			width: "200px",
			renderCell: (feedback) => (
				<div className="flex flex-col">
					<Label>{feedback.raisedBy.name}</Label>
					<span className="text-xs text-gray-500">
						{feedback.raisedBy.name}
					</span>
				</div>
			),
		},
		{
			field: "createdAt",
			headerName: "Created",
			sortable: true,
			width: "150px",
			renderCell: (feedback) => (
				<span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: "100px",
			renderCell: (feedback) => {
				console.log(
					feedback.raisedBy._id,
					user?.id,
					feedback.raisedBy._id === user?.id,
					"feedback.raisedBy._id === user?.id"
				);
				return (
					<Button
						className="text-white"
						size={"icon"}
						onClick={() => onEdit?.(feedback)}
						disabled={feedback.raisedBy._id !== user?.id}
					>
						<Edit />
					</Button>
				);
			},
		},
	];

	return (
		<div className="w-full h-full overflow-auto">
			<FMTable
				columns={feedbackColumns}
				data={data}
				showConfigMenu
				exportOptions={{ enabled: true }}
			/>
		</div>
	);
};

export default FeedbackTable;
