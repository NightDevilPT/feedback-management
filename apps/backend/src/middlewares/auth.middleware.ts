// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { AuthRequest } from "../interface/user.interface";

export const authenticateUser = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		// 1. Get token from cookies
		const token = req.cookies.accessToken;

		if (!token) {
			return res.status(401).json({
				status: "error",
				message: "Authentication required - No token provided",
			});
		}

		// 2. Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_ACCESS_SECRET as string
		) as { userId: string };

		// 3. Check if user still exists
		const user = await User.findById(decoded.userId).select("_id role");

		if (!user) {
			return res.status(401).json({
				status: "error",
				message: "User belonging to this token no longer exists",
			});
		}

		// 4. Attach user to request
		req.user = {
			userId: user._id.toString(),
			role: user.role,
		};

		next();
	} catch (error) {
		console.error("Authentication error:", error);

		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({
				status: "error",
				message: "Session expired, please login again",
			});
		}

		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
				status: "error",
				message: "Invalid token, please login again",
			});
		}

		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};

// Optional: Role-based access control middleware
export const restrictTo = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({
				status: "error",
				message: "You do not have permission to perform this action",
			});
		}
		next();
	};
};
