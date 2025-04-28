"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	FeedbackCategory,
	FeedbackStatus,
} from "@/src/interface/feedback.interface";
import { useToast } from "@/src/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import apiService from "@/src/services/api.service";
import { useEffect } from "react";

// Feedback form schema
const feedbackSchema = z.object({
	rating: z.number().min(1).max(5),
	comment: z.string().min(10).max(1000),
	category: z.nativeEnum(FeedbackCategory),
	type: z.nativeEnum(FeedbackCategory),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSuccess?: () => void;
	feedback?: {
		id: string;
		rating: number;
		comment: string;
		category: FeedbackCategory;
		type: FeedbackCategory;
		status: FeedbackStatus;
	};
}

export function FeedbackModal({
	open,
	setOpen,
	onSuccess,
	feedback,
}: FeedbackModalProps) {
	console.log("FeedbackModal", feedback);
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FeedbackFormData>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			rating: 5,
			comment: "",
			category: FeedbackCategory.SUGGESTION,
			type: FeedbackCategory.SUGGESTION,
		},
	});

	useEffect(()=>{
		if (feedback) {
			setValue("rating", feedback.rating);
			setValue("comment", feedback.comment);
			setValue("category", feedback.category);
			setValue("type", feedback.type);
		} else {
			reset();
		}
	},[feedback])

	const onSubmit = async (data: FeedbackFormData) => {
		try {
			let response;
			if (feedback) {
				// Update existing feedback
				response = await apiService.patch(`/feedback/${feedback.id}`, {
					...data,
					status: feedback.status,
				});
			} else {
				// Create new feedback
				response = await apiService.post("/feedback", {
					...data,
					status: FeedbackStatus.OPEN,
				});
			}

			if (!response) {
				throw new Error("Failed to submit feedback");
			}

			toast({
				title: "Success",
				description: feedback 
					? "Feedback updated successfully!" 
					: "Thank you for your feedback!",
			});

			setOpen(false);
			reset();
			onSuccess?.();
		} catch (error: any) {
			console.error("Feedback submission error:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to submit feedback",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{feedback ? "Edit Feedback" : "Submit Feedback"}
					</DialogTitle>
					<DialogDescription>
						{feedback 
							? "Update your feedback details below."
							: "Help us improve by sharing your thoughts and suggestions."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Rating */}
					<div className="space-y-2">
						<Label>
							Rating <span className="text-red-500">*</span>
						</Label>
						<div className="flex items-center gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setValue("rating", star)}
									className={`text-2xl ${
										watch("rating") >= star
											? "text-yellow-500"
											: "text-gray-300"
									}`}
								>
									★
								</button>
							))}
						</div>
						<input
							type="hidden"
							{...register("rating", { valueAsNumber: true })}
						/>
						{errors.rating && (
							<p className="text-red-600 text-sm">
								{errors.rating.message}
							</p>
						)}
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label>
							Category <span className="text-red-500">*</span>
						</Label>
						<Select
							onValueChange={(value: FeedbackCategory) => {
								setValue("category", value);
								setValue("type", value); // Set type to match category by default
							}}
							defaultValue={FeedbackCategory.SUGGESTION}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(FeedbackCategory).map(
									(category) => (
										<SelectItem
											key={category}
											value={category}
										>
											{category.charAt(0).toUpperCase() +
												category.slice(1)}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
						{errors.category && (
							<p className="text-red-600 text-sm">
								{errors.category.message}
							</p>
						)}
					</div>

					{/* Type */}
					<div className="space-y-2">
						<Label>
							Type <span className="text-red-500">*</span>
						</Label>
						<Select
							onValueChange={(value: FeedbackCategory) =>
								setValue("type", value)
							}
							defaultValue={FeedbackCategory.SUGGESTION}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a type" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(FeedbackCategory).map((type) => (
									<SelectItem key={type} value={type}>
										{type.charAt(0).toUpperCase() +
											type.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.type && (
							<p className="text-red-600 text-sm">
								{errors.type.message}
							</p>
						)}
					</div>

					{/* Comment */}
					<div className="space-y-2">
						<Label>
							Your Feedback{" "}
							<span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="comment"
							{...register("comment")}
							placeholder="Please provide detailed feedback..."
							rows={5}
							className="min-h-[120px]"
						/>
						{errors.comment && (
							<p className="text-red-600 text-sm">
								{errors.comment.message}
							</p>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								reset();
								setOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Submitting..." : "Submit Feedback"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
