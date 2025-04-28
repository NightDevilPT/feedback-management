"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/provider/auth-provider";
import useApi from "@/src/hooks/use-api";
import { DataView } from "@/src/components/view-layout";
import { Button } from "@/src/components/ui/button";
import Loader from "@/src/components/ui/loader";
import {
	FeedbackResponse,
	PaginationFeedbackResponse,
	FeedbackCategory,
	FeedbackStatus,
} from "@/src/interface/feedback.interface";
import { FeedbackModal } from "../../_components/FeedBackForm";
import FeedbackTable from "../../_components/FeedbackTable";
import { FeedbackGridView } from "../../_components/FeedbackGrid";

export const UserFeedbackPage = ({ id }: { id: string }) => {
	const { user } = useAuth();
	const { get, isLoading, error } = useApi();
	const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

	const fetchFeedbacks = async () => {
		if (!id) return;
		try {
			const response = await get<PaginationFeedbackResponse>(
				`/feedback/user/${id}?page=${page}&limit=${limit}`
			);
			console.log(response.data, "response.data");
			setFeedbacks(response.data);
			setTotalPages(response.meta.totalPages);
			setTotalItems(response.meta.totalItems);
		} catch (err) {
			console.error("Failed to fetch feedbacks", err);
		}
	};

	useEffect(() => {
		if (id) {
			fetchFeedbacks();
		}
	}, [page, limit, id]);

	const handleEdit = (feedback: FeedbackResponse) => {
		setSelectedFeedback({
			id: feedback._id,
			rating: feedback.rating,
			comment: feedback.comment,
			category: feedback.category,
			type: feedback.type,
			status: feedback.status,
		});
		setOpen(true);
	};

	const handleSuccess = () => {
		fetchFeedbacks();
		setSelectedFeedback(null);
		setOpen(false);
	};

	if (!user) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				Please login to view your feedbacks
			</div>
		);
	}

	return (
		<div className="w-full h-full overflow-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{user.id === id ? "My Feedbacks" : "User Feedbacks"}
				</h1>
				<Button onClick={() => setOpen(true)}>
					Submit New Feedback
				</Button>
			</div>

			<FeedbackModal
				open={open}
				setOpen={setOpen}
				onSuccess={handleSuccess}
				feedback={selectedFeedback}
			/>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Loader />
				</div>
			) : error ? (
				<div className="text-red-500 text-center py-8">
					Error loading feedbacks: {error.message}
				</div>
			) : feedbacks.length > 0 ? (
				<DataView
					data={feedbacks}
					totalItems={totalItems}
					totalPage={totalPages}
					itemsPerPage={limit}
					currentPage={page}
					onPageChange={setPage}
					tableView={
						<FeedbackTable
							id={id}
							data={feedbacks}
							onEdit={handleEdit}
						/>
					}
					gridView={
						<FeedbackGridView
							id={id}
							data={feedbacks}
							onEdit={handleEdit}
						/>
					}
				/>
			) : (
				<div className="text-center py-12">
					{user.id === id ? (
						<>
							<p className="text-lg text-gray-500 mb-4">
								You haven't submitted any feedback yet.
							</p>
							<Button onClick={() => setOpen(true)}>
								Submit Your First Feedback
							</Button>
						</>
					) : (
						<p className="text-lg text-gray-500 mb-4">
							This user hasn't submitted any feedback yet.
						</p>
					)}
				</div>
			)}
		</div>
	);
};
