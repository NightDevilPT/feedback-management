import { PaginatedResponse } from "./common.interface";

export enum FeedbackCategory {
	SUGGESTION = "suggestion",
	BUG = "bug",
	FEATURE = "feature",
}

export enum FeedbackStatus {
	OPEN = "open",
	IN_PROGRESS = "in-progress",
	RESOLVED = "resolved",
}

export interface FeedbackResponse {
	_id: string;
	userId: string;
	raisedBy: { _id: string; email: string; name: string };
	rating: number;
	comment: string;
	type: FeedbackCategory;
	category: FeedbackCategory;
	status: FeedbackStatus;
	createdAt: string;
	updatedAt: string;
	actions?: any;
}

export interface PaginationFeedbackResponse
	extends PaginatedResponse<FeedbackResponse> {}
