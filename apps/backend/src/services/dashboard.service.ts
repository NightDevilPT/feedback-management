import {
	DashboardResponse,
	FeedbackItem,
	TopRatedFeedback,
} from "../interface/dashboard.interface";
import User from "../model/user.model";
import { logger } from "../utils/logger.util";
import { Request, Response } from "express";
import { Feedback, FeedbackStatus } from "../model/feedback.model";

export const getDashboardData = async (
	req: Request,
	res: Response<DashboardResponse | null>
) => {
	try {
		// 1. Parallelize all database queries for better performance
		const [
			totalUsers,
			totalFeedback,
			feedbackByCategory,
			feedbackByStatus,
			feedbackTrend,
			averageRating,
			recentFeedback,
			userActivity,
			feedbackResolutionTime,
			topRatedFeedback,
		] = await Promise.all([
			// Card Data
			User.countDocuments(),
			Feedback.countDocuments(),

			// Chart Data - Aggregations
			Feedback.aggregate([
				{ $group: { _id: "$category", count: { $sum: 1 } } },
				{ $project: { category: "$_id", count: 1, _id: 0 } },
			]),

			Feedback.aggregate([
				{ $group: { _id: "$status", count: { $sum: 1 } } },
				{ $project: { status: "$_id", count: 1, _id: 0 } },
			]),

			// Trend Data (last 30 days)
			Feedback.aggregate([
				{
					$match: {
						createdAt: {
							$gte: new Date(
								new Date().setDate(new Date().getDate() - 30)
							),
						},
					},
				},
				{
					$group: {
						_id: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$createdAt",
							},
						},
						count: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
				{ $project: { date: "$_id", count: 1, _id: 0 } },
			]),

			// Average Rating
			Feedback.aggregate([
				{ $group: { _id: null, average: { $avg: "$rating" } } },
			]),

			// Recent Feedback (with user details)
			Feedback.find()
				.sort({ createdAt: -1 })
				.limit(5)
				.populate("raisedBy", "name email role"),

			// User Activity (recent active users)
			Feedback.aggregate([
				{
					$lookup: {
						from: "users",
						localField: "raisedBy",
						foreignField: "_id",
						as: "user",
					},
				},
				{ $unwind: "$user" },
				{
					$group: {
						_id: "$user._id",
						name: { $first: "$user.name" },
						email: { $first: "$user.email" },
						feedbackCount: { $sum: 1 },
						lastActivity: { $max: "$createdAt" },
					},
				},
				{ $sort: { lastActivity: -1 } },
				{ $limit: 5 },
			]),

			// Feedback Resolution Time (avg days to resolve)
			Feedback.aggregate([
				{ $match: { status: FeedbackStatus.RESOLVED } },
				{
					$addFields: {
						resolutionDays: {
							$divide: [
								{ $subtract: ["$updatedAt", "$createdAt"] },
								1000 * 60 * 60 * 24,
							],
						},
					},
				},
				{
					$group: {
						_id: null,
						avgResolutionDays: { $avg: "$resolutionDays" },
					},
				},
			]),

			// Top Rated Feedback
			Feedback.find()
				.sort({ rating: -1 })
				.limit(3)
				.populate("raisedBy", "name"),
		]);

		// 2. Add calculated metrics
		const openPercentage =
			totalFeedback > 0
				? Math.round(
						((feedbackByStatus.find(
							(f) => f.status === FeedbackStatus.OPEN
						)?.count || 0) /
							totalFeedback) *
							100
				  )
				: 0;

		const resolutionRate =
			totalFeedback > 0
				? Math.round(
						((feedbackByStatus.find(
							(f) => f.status === FeedbackStatus.RESOLVED
						)?.count || 0) /
							totalFeedback) *
							100
				  )
				: 0;

		// 3. Format response
		res.status(200).json({
			status: "success",
			message: "Dashboard data retrieved successfully",
			data: {
				// Summary Cards
				summary: {
					totalUsers,
					totalFeedback,
					openFeedback:
						feedbackByStatus.find(
							(f) => f.status === FeedbackStatus.OPEN
						)?.count || 0,
					resolvedFeedback:
						feedbackByStatus.find(
							(f) => f.status === FeedbackStatus.RESOLVED
						)?.count || 0,
					averageRating: averageRating[0]?.average
						? averageRating[0].average.toFixed(1)
						: 0,
					openPercentage,
					resolutionRate,
					avgResolutionDays: feedbackResolutionTime[0]
						?.avgResolutionDays
						? feedbackResolutionTime[0].avgResolutionDays.toFixed(1)
						: 0,
				},

				// Charts Data
				charts: {
					byCategory: feedbackByCategory,
					byStatus: feedbackByStatus,
					trend: feedbackTrend,
					byRating: await getRatingDistribution(),
				},

				// Activity Data
				activity: {
					recentFeedback:
						recentFeedback as unknown as FeedbackItem[],
					userActivity,
					topRatedFeedback:
						topRatedFeedback as unknown as TopRatedFeedback[],
				},

				// Time-based Metrics (last 7 days comparison)
				trends: {
					feedbackLast7Days: await getPeriodComparison(7),
					resolutionLast7Days: await getPeriodComparison(
						7,
						FeedbackStatus.RESOLVED
					),
				},
			},
		});
	} catch (error) {
		logger.error("Dashboard data error:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to retrieve dashboard data",
			data: null,
		});
	}
};

// Helper: Get rating distribution
async function getRatingDistribution() {
	return Feedback.aggregate([
		{
			$bucket: {
				groupBy: "$rating",
				boundaries: [1, 2, 3, 4, 5, 6],
				default: "other",
				output: {
					count: { $sum: 1 },
				},
			},
		},
		{
			$project: {
				rating: "$_id",
				count: 1,
				_id: 0,
			},
		},
		{ $sort: { rating: 1 } },
	]);
}

// Helper: Compare current period with previous period
async function getPeriodComparison(days: number, status?: FeedbackStatus) {
	const currentPeriod = new Date();
	const previousPeriod = new Date();
	previousPeriod.setDate(previousPeriod.getDate() - days);

	const matchStage: any = {
		createdAt: {
			$gte: previousPeriod,
			$lt: currentPeriod,
		},
	};

	if (status) matchStage.status = status;

	const [currentCount, previousCount] = await Promise.all([
		Feedback.countDocuments(matchStage),
		Feedback.countDocuments({
			createdAt: {
				$lt: previousPeriod,
				$gte: new Date(
					previousPeriod.getTime() - days * 24 * 60 * 60 * 1000
				),
			},
			...(status ? { status } : {}),
		}),
	]);

	return {
		current: currentCount,
		previous: previousCount,
		change:
			previousCount > 0
				? (
						((currentCount - previousCount) / previousCount) *
						100
				  ).toFixed(1)
				: "N/A",
	};
}
