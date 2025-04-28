import { Request } from "express";
import { PaginatedResponse } from "./common.interface";

export interface AuthRequest extends Request {
	user?: {
		userId: string;
		role: string;
	};
	cookies: {
		[key: string]: string;
	};
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	role: "user" | "admin";
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface UpdateUserRequest {
	name?: string;
	email?: string;
	password?: string;
}

// User with additional fields for paginated responses
export interface UserResponse {
	userId: string;
	name: string;
	email: string;
	role: "user" | "admin";
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthResponse {
	status: "success" | "error";
	message: string;
	data?: UserResponse;
}

export interface PaginatedUsersResponse
	extends PaginatedResponse<UserResponse> {
	feedbackCount?: number;
}
