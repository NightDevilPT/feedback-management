import { FeedbackCategory, FeedbackStatus } from "../model/feedback.model";

export interface CreateFeedbackRequest {
	rating: number;
	comment: string;
	type: FeedbackCategory;
	category: FeedbackCategory;
}

export interface UpdateFeedbackRequest {
	rating?: number;
	comment?: string;
	type?: FeedbackCategory;
	category?: FeedbackCategory;
	status?: FeedbackStatus;
}
