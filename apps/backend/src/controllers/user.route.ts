import {
	CreateUser,
	getAllUsers,
	GetMe,
	LoginUser,
	LogoutUser,
	UpdateUser,
} from "../services/user.service";
import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";

const userRouter = Router();

/**
 * Register a new user
 * @route POST /user/register
 */
userRouter.post("/register", CreateUser);

/**
 * Login user
 * @route POST /user/login
 */
userRouter.post("/login", LoginUser);

/**
 * Logout user
 * @route POST /user/logout
 */
userRouter.post("/logout", LogoutUser);

/**
 * Update user details
 * @route PATCH /user/update
 */
userRouter.patch("/update", authenticateUser, UpdateUser);

/**
 * Get user details
 * @route GET /user
 */
userRouter.get("/me", authenticateUser, GetMe);

/**
 * Get user details
 * @route GET /all
 */

userRouter.get("/all", getAllUsers);

export default userRouter;
