"use client";

import { useEffect, useState } from "react";
import { FeedbackResponse } from "@/src/interface/feedback.interface";
import { FeedbackModal } from "../_components/FeedBackForm";
import FeedbackTable from "../_components/FeedbackTable";
import { FeedbackGridView } from "../_components/FeedbackGrid";
import { Button } from "@/src/components/ui/button";
import { Plus, Table, Grid } from "lucide-react";
import apiService from "@/src/services/api.service";

export default function FeedbackPage() {
	const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");

	const fetchFeedbacks = async () => {
		try {
			const response = await apiService.get("/feedback");
			if (response?.data) {
				setFeedbacks(response.data);
			}
		} catch (error) {
			console.error("Error fetching feedbacks:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFeedbacks();
	}, []);

	const handleEdit = (feedback: FeedbackResponse) => {
		setSelectedFeedback(feedback);
		setIsModalOpen(true);
	};

	const handleSuccess = () => {
		fetchFeedbacks();
		setSelectedFeedback(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Feedback Management</h1>
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<Button
							variant={viewMode === "table" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("table")}
						>
							<Table className="w-4 h-4 mr-2" />
							Table
						</Button>
						<Button
							variant={viewMode === "grid" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("grid")}
						>
							<Grid className="w-4 h-4 mr-2" />
							Grid
						</Button>
					</div>
					<Button onClick={() => setIsModalOpen(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Add Feedback
					</Button>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				</div>
			) : viewMode === "table" ? (
				<FeedbackTable
					data={feedbacks}
					onEdit={handleEdit}
				/>
			) : (
				<FeedbackGridView
					data={feedbacks}
					onEdit={handleEdit}
				/>
			)}

			<FeedbackModal
				open={isModalOpen}
				setOpen={setIsModalOpen}
				onSuccess={handleSuccess}
				feedback={selectedFeedback || undefined}
			/>
		</div>
	);
} 