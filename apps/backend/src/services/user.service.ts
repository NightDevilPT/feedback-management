import jwt from "jsonwebtoken";
import {
	AuthRequest,
	LoginRequest,
	PaginatedUsersResponse,
	RegisterRequest,
	UpdateUserRequest,
	UserResponse,
} from "../interface/user.interface";
import User from "../model/user.model";
import type { Request, Response } from "express";
import { Feedback } from "../model/feedback.model";
import { PaginationMeta } from "../interface/common.interface";

// Helper to create tokens
const createAccessToken = (userId: string) => {
	return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
		expiresIn: "15m", // Access Token valid for 15 minutes
	});
};

const createRefreshToken = (userId: string) => {
	return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
		expiresIn: "20m", // Refresh Token valid for 20 minutes
	});
};

// This function handles user registration
export const CreateUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password, role } = req.body as RegisterRequest;
		console.log("Registering user:", { name, email, password, role });

		if (!name || !email || !password) {
			return res.status(400).json({
				status: "error",
				message: "Name, email, and password are required",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({
				status: "error",
				message: "Email already registered",
			});
		}

		const user = await User.create({ name, email, password, role });

		return res.status(201).json({
			status: "success",
			message: "User registered successfully",
			data: {
				userId: user._id.toString(),
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error("User registration error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function handles user login
export const LoginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as LoginRequest;

		if (!email || !password) {
			return res.status(400).json({
				status: "error",
				message: "Email and password are required",
			});
		}

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(401).json({
				status: "error",
				message: "Invalid credentials",
			});
		}

		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			return res.status(401).json({
				status: "error",
				message: "Invalid credentials",
			});
		}

		const accessToken = createAccessToken(user._id.toString());
		const refreshToken = createRefreshToken(user._id.toString());

		// Set cookies
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 15 * 60 * 1000, // 15 minutes
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 20 * 60 * 1000, // 20 min
		});

		return res.status(200).json({
			status: "success",
			message: "Login successful",
			data: {
				userId: user._id.toString(),
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error("User login error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function handles user logout
export const LogoutUser = (req: Request, res: Response) => {
	try {
		res.clearCookie("accessToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});

		return res.status(200).json({
			status: "success",
			message: "Logged out successfully",
		});
	} catch (error) {
		console.error("User logout error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function handles user updates
// It allows users to update their name, email, and password
export const UpdateUser = async (req: AuthRequest, res: Response) => {
	try {
		const { name, password } = req.body as UpdateUserRequest;
		const userId = req.user?.userId; // From auth middleware

		if (!userId) {
			return res.status(401).json({
				status: "error",
				message: "Authentication required",
			});
		}

		// Find the user
		const user = await User.findById(userId).select("+password");
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}

		// Initialize update object
		const updateData: Partial<{
			name: string;
			password: string;
		}> = {};

		// Update name if provided
		if (name) {
			updateData.name = name;
		}

		// Update password if provided (requires current password)
		if (password) {
			updateData.password = password;
		}

		// If no updates were requested
		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({
				status: "error",
				message: "No updates provided",
			});
		}

		// Apply updates
		const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
			new: true,
			runValidators: true,
		});

		return res.status(200).json({
			status: "success",
			message: "User updated successfully",
			data: {
				userId: updatedUser?._id.toString(),
				name: updatedUser?.name,
				email: updatedUser?.email,
				role: updatedUser?.role,
				updatedAt: updatedUser?.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error("User update error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// This function handles getting the current user's data
export const GetMe = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			return res.status(401).json({
				status: "error",
				message: "Authentication required",
			});
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}

		return res.status(200).json({
			status: "success",
			data: {
				userId: user._id.toString(),
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		console.error("Get me error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response<PaginatedUsersResponse>
) => {
	try {
		const { page = 1, limit = 10, search } = req.query;
		const pageNumber = parseInt(page as string);
		const limitNumber = parseInt(limit as string);

		const filter: Record<string, unknown> = {};

		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		// Count total users
		const totalUsers = await User.countDocuments(filter);
		const totalPages = Math.ceil(totalUsers / limitNumber);
		const skip = (pageNumber - 1) * limitNumber;

		// Get users with pagination
		const users = await User.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limitNumber)
			.lean();

		// Get feedback counts for each user
		const usersWithFeedback = await Promise.all(
			users.map(async (user) => {
				const feedbackCount = await Feedback.countDocuments({
					raisedBy: user._id,
				});
				return {
					...user,
					userId: user._id.toString(),
					feedbackCount,
				};
			})
		);

		// Build pagination metadata
		const meta: PaginationMeta = {
			totalItems: totalUsers,
			itemCount: usersWithFeedback.length,
			itemsPerPage: limitNumber,
			totalPages,
			currentPage: pageNumber,
		};

		return res.status(200).json({
			status: "success",
			message: "Users retrieved successfully",
			data: usersWithFeedback as UserResponse[],
			meta,
		});
	} catch (error) {
		console.error("Get all users error:", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		} as PaginatedUsersResponse);
	}
};
