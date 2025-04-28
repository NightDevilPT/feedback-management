import { Request, Response } from "express";
import { Feedback, FeedbackStatus } from "../model/feedback.model";
import { AuthRequest } from "../interface/user.interface";

// This function handles feedback creation
export const CreateFeedback = async (req: AuthRequest, res: Response) => {
	try {
		const { rating, comment, type, category } = req.body;
    console.log(req.body, "req.body");
		const raisedBy = req.user?.userId;

		if (!raisedBy) {
			return res.status(401).json({
				status: "error",
				message: "Authentication required",
			});
		}

		const feedback = await Feedback.create({
			raisedBy,
			rating,
			comment,
			type,
			category,
			status: FeedbackStatus.OPEN,
		});

    if (!feedback) {
      return res.status(400).json({
        status: "error",
        message: "Failed to create feedback",
      });
    }

		return res.status(201).json({
			status: "success",
			message: "Feedback created successfully",
			data: feedback,
		});
	} catch (error) {
		console.error("Feedback creation error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function gets all feedback with optional filters
// This function gets all feedback with optional filters and pagination
export const GetAllFeedback = async (req: Request, res: Response) => {
	try {
		const { status, category, minRating, page = 1, limit = 10 } = req.query;
		const pageNumber = parseInt(page as string);
		const limitNumber = parseInt(limit as string);

		const filter: any = {};

		if (status) filter.status = status;
		if (category) filter.category = category;
		if (minRating) filter.rating = { $gte: Number(minRating) };

		// Count total documents
		const totalResults = await Feedback.countDocuments(filter);
		const totalPages = Math.ceil(totalResults / limitNumber);
		const skip = (pageNumber - 1) * limitNumber;

		const feedbacks = await Feedback.find(filter)
			.populate("raisedBy", "name email")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limitNumber);

		// Build pagination metadata
		const meta = {
			totalResults,
			totalPages,
			currentPage: pageNumber,
			resultsPerPage: limitNumber,
			hasPreviousPage: pageNumber > 1,
			hasNextPage: pageNumber < totalPages,
			previousPage: pageNumber > 1 ? pageNumber - 1 : null,
			nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
		};

		return res.status(200).json({
			status: "success",
			meta,
			results: feedbacks.length,
			data: feedbacks,
		});
	} catch (error) {
		console.error("Get feedback error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function gets single feedback by ID
export const GetFeedback = async (req: Request, res: Response) => {
	try {
		const feedback = await Feedback.findById(req.params.id);

		if (!feedback) {
			return res.status(404).json({
				status: "error",
				message: "Feedback not found",
			});
		}

		return res.status(200).json({
			status: "success",
			data: feedback,
		});
	} catch (error) {
		console.error("Get feedback error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function updates feedback
export const UpdateFeedback = async (req: AuthRequest, res: Response) => {
	try {
		const { rating, comment, category, type, status } = req.body;
		const feedbackId = req.params.id;
		const userId = req.user?.userId;

		if (!userId) {
			return res.status(401).json({
				status: "error",
				message: "Authentication required",
			});
		}

		const feedback = await Feedback.findById(feedbackId);
		if (!feedback) {
			return res.status(404).json({
				status: "error",
				message: "Feedback not found",
			});
		}

		// Check if user is the owner or admin
		if (feedback.raisedBy.toString() !== userId && req.user?.role !== "admin") {
			return res.status(403).json({
				status: "error",
				message: "Not authorized to update this feedback",
			});
		}

		const updatedFeedback = await Feedback.findByIdAndUpdate(
			feedbackId,
			{ rating, comment, category, type, status },
			{ new: true, runValidators: true }
		).populate("raisedBy", "name email");

		return res.status(200).json({
			status: "success",
			message: "Feedback updated successfully",
			data: updatedFeedback,
		});
	} catch (error) {
		console.error("Update feedback error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function deletes feedback
export const DeleteFeedback = async (req: AuthRequest, res: Response) => {
	try {
		const feedbackId = req.params.id;
		const userId = req.user?.userId;

		const feedback = await Feedback.findById(feedbackId);

		if (!feedback) {
			return res.status(404).json({
				status: "error",
				message: "Feedback not found",
			});
		}

		// Only allow original creator or admin to delete
		if (
			feedback.raisedBy.toString() !== userId &&
			req.user?.role !== "admin"
		) {
			return res.status(403).json({
				status: "error",
				message: "Not authorized to delete this feedback",
			});
		}

		await Feedback.findByIdAndDelete(feedbackId);

		return res.status(204).json({
			message: "Feedback deleted successfully",
		});
	} catch (error) {
		console.error("Delete feedback error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function gets feedback for the logged-in user
export const GetUserFeedback = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.params.id;
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		if (!userId) {
			return res.status(401).json({
				status: "error",
				message: "Authentication required",
			});
		}

		const skip = (page - 1) * limit;
		const [feedbacks, total] = await Promise.all([
			Feedback.find({ raisedBy: userId })
				.populate("raisedBy", "name email")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			Feedback.countDocuments({ raisedBy: userId })
		]);

		return res.status(200).json({
			status: "success",
			data: feedbacks,
			meta: {
				totalItems: total,
				itemCount: feedbacks.length,
				itemsPerPage: limit,
				totalPages: Math.ceil(total / limit),
				currentPage: page
			}
		});
	} catch (error) {
		console.error("Get user feedback error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};
