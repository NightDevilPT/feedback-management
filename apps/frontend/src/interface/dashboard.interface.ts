// dashboard.interface.ts
import { FeedbackCategory, FeedbackStatus } from "./feedback.interface";

export interface UserBasicInfo {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserActivityInfo {
  _id: string;
  name: string;
  email: string;
  feedbackCount: number;
  lastActivity: string;
}

export interface FeedbackItem {
  _id: string;
  raisedBy: UserBasicInfo;
  rating: number;
  comment: string;
  type: FeedbackCategory;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TopRatedFeedback extends Omit<FeedbackItem, 'raisedBy'> {
  raisedBy: {
    _id: string;
    name: string;
  };
}

export interface CategoryCount {
  count: number;
  category: FeedbackCategory;
}

export interface StatusCount {
  count: number;
  status: FeedbackStatus;
}

export interface TrendData {
  count: number;
  date: string;
}

export interface RatingDistribution {
  count: number;
  rating: number;
}

export interface PeriodComparison {
  current: number;
  previous: number;
  change: string | number;
}

export interface DashboardSummary {
  totalUsers: number;
  totalFeedback: number;
  openFeedback: number;
  resolvedFeedback: number;
  averageRating: string;
  openPercentage: number;
  resolutionRate: number;
  avgResolutionDays: number;
}

export interface DashboardCharts {
  byCategory: CategoryCount[];
  byStatus: StatusCount[];
  trend: TrendData[];
  byRating: RatingDistribution[];
}

export interface DashboardActivity {
  recentFeedback: FeedbackItem[];
  userActivity: UserActivityInfo[];
  topRatedFeedback: TopRatedFeedback[];
}

export interface DashboardTrends {
  feedbackLast7Days: PeriodComparison;
  resolutionLast7Days: PeriodComparison;
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: {
    summary: DashboardSummary;
    charts: DashboardCharts;
    activity: DashboardActivity;
    trends: DashboardTrends;
  };
}