import { PaginatedResponse } from "./common.interface";

export enum UserRole {
	USER = "user",
	ADMIN = "admin",
}

// User with additional fields for paginated responses
export interface UserResponse {
	userId: string;
	name: string;
	email: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
	feedbackCount?: number;
	actions?: any;
}

export interface PaginatedUsersResponse
	extends PaginatedResponse<UserResponse> {}
