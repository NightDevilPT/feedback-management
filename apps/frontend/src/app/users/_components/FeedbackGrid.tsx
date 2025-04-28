"use client";

import { Star, Calendar, User } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
	FeedbackResponse,
	FeedbackCategory,
	FeedbackStatus,
} from "@/src/interface/feedback.interface";
import { useAuth } from "@/src/provider/auth-provider";

interface FeedbackCardProps {
	feedback: FeedbackResponse;
	onEdit?: (feedback: FeedbackResponse) => void;
	id: string;
}

export const FeedbackCard = ({ feedback, onEdit, id }: FeedbackCardProps) => {
	const { user } = useAuth();
	const getCategoryColor = (category: FeedbackCategory) => {
		switch (category) {
			case FeedbackCategory.BUG:
				return "bg-red-100 text-red-800";
			case FeedbackCategory.FEATURE:
				return "bg-blue-100 text-blue-800";
			case FeedbackCategory.SUGGESTION:
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusColor = (status: FeedbackStatus) => {
		switch (status) {
			case FeedbackStatus.OPEN:
				return "bg-yellow-100 text-yellow-800";
			case FeedbackStatus.IN_PROGRESS:
				return "bg-blue-100 text-blue-800";
			case FeedbackStatus.RESOLVED:
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
			<div className="p-4">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-2">
						<div className="flex items-center">
							<Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
							<span className="font-medium">
								{feedback.rating}/5
							</span>
						</div>
						<Badge className={getCategoryColor(feedback.category)}>
							{feedback.category}
						</Badge>
						<Badge className={getStatusColor(feedback.status)}>
							{feedback.status}
						</Badge>
					</div>
				</div>

				<div className="mb-4">
					<p className="text-sm text-gray-600 line-clamp-3">
						{feedback.comment}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
					<div className="flex items-center">
						<User className="h-4 w-4 mr-2" />
						<span className="truncate">
							{feedback.raisedBy.name}
						</span>
					</div>
					<div className="flex items-center">
						<Calendar className="h-4 w-4 mr-2" />
						<span>
							{new Date(feedback.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				{feedback.raisedBy._id === user?.id && onEdit && (
					<div className="mt-4">
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => onEdit(feedback)}
						>
							Edit
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

// Grid view component that uses the FeedbackCard
interface FeedbackGridViewProps {
	data: FeedbackResponse[];
	onEdit?: (feedback: FeedbackResponse) => void;
	id: string;
}

export const FeedbackGridView = ({
	data,
	id,
	onEdit,
}: FeedbackGridViewProps) => {
	return (
		<div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{data.map((feedback) => (
				<FeedbackCard
					key={feedback._id}
					id={id}
					feedback={feedback}
					onEdit={onEdit}
				/>
			))}
		</div>
	);
};
