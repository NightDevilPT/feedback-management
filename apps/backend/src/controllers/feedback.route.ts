import {
	CreateFeedback,
	GetFeedback,
	GetAllFeedback,
	UpdateFeedback,
	DeleteFeedback,
	GetUserFeedback,
} from "../services/feedback.service";
import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";

const feedbackRouter = Router();

/**
 * Create new feedback
 * @route POST /feedback
 */
feedbackRouter.post("/", authenticateUser, CreateFeedback);

/**
 * Get all feedback (filterable)
 * @route GET /feedback
 */
feedbackRouter.get("/", GetAllFeedback);

/**
 * Get feedback by ID
 * @route GET /feedback/:id
 */
feedbackRouter.get("/:id", GetFeedback);

/**
 * Update feedback
 * @route PATCH /feedback/:id
 */
feedbackRouter.patch("/:id", authenticateUser, UpdateFeedback);

/**
 * Delete feedback
 * @route DELETE /feedback/:id
 */
feedbackRouter.delete("/:id", authenticateUser, DeleteFeedback);

/**
 * Get feedback for logged-in user
 * @route GET /feedback/user/me
 */
feedbackRouter.get("/user/me", authenticateUser, GetUserFeedback);


/**
 * Get feedback for logged-in user
 * @route GET /feedback/user/me
 */
feedbackRouter.get("/user/:id", GetUserFeedback);

export default feedbackRouter;
