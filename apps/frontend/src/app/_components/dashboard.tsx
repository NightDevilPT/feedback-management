"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/provider/auth-provider";
import useApi from "@/src/hooks/use-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  Check,
  Clock,
  Star,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { DashboardResponse } from "@/src/interface/dashboard.interface";
import Loader from "@/src/components/ui/loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const DashboardPage = () => {
  const { get, isLoading, error } = useApi();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await get<DashboardResponse>("/dashboard");
      console.log(response, "Dashboard Data");
      setDashboardData(response);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !dashboardData || !dashboardData.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading dashboard data</p>
        <Button onClick={fetchDashboardData} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  const { summary, activity } = dashboardData.data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Feedback Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Users"
          value={summary.totalUsers}
          icon={<User className="h-6 w-6" />}
        />
        <SummaryCard
          title="Total Feedback"
          value={summary.totalFeedback}
          icon={<MessageSquare className="h-6 w-6" />}
        />
        <SummaryCard
          title="Open Feedback"
          value={summary.openFeedback}
          icon={<AlertCircle className="h-6 w-6" />}
          change={summary.openPercentage}
        />
        <SummaryCard
          title="Resolved Feedback"
          value={summary.resolvedFeedback}
          icon={<Check className="h-6 w-6" />}
          change={summary.resolutionRate}
        />
        <SummaryCard
          title="Average Rating"
          value={summary.averageRating}
          icon={<Star className="h-6 w-6" />}
          isRating
        />
        <SummaryCard
          title="Avg Resolution Time"
          value={`${summary.avgResolutionDays} days`}
          icon={<Clock className="h-6 w-6" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard
          title="Recent Feedback"
          items={activity.recentFeedback.map((fb) => ({
            title: fb.comment.substring(0, 20) + (fb.comment.length > 20 ? "..." : ""),
            description: fb.comment,
            date: fb.createdAt,
            user: fb.raisedBy.name,
            rating: fb.rating,
            status: fb.status,
            category: fb.category
          }))}
        />

        <ActivityCard
          title="Active Users"
          items={activity.userActivity.map((user) => ({
            title: user.name,
            description: user.email,
            date: user.lastActivity,
            meta: `${user.feedbackCount} feedbacks`,
          }))}
        />
      </div>

      {/* Top Rated Feedback */}
      {activity.topRatedFeedback.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activity.topRatedFeedback.map((feedback, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {feedback.comment.substring(0, 20)}{feedback.comment.length > 20 ? "..." : ""}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{feedback.raisedBy.name}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{feedback.comment}</p>
                    <div className="flex justify-between items-center mt-3">
                      <Badge variant="outline">{feedback.category}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper Components
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  isRating?: boolean;
}

const SummaryCard = ({ title, value, icon, change, isRating = false }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isRating ? (
            <div className="flex items-center">
              {value}
              <Star className="h-5 w-5 ml-1 text-yellow-500 fill-yellow-500" />
            </div>
          ) : (
            value
          )}
        </div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {change >= 0 ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            {Math.abs(change)}% {change >= 0 ? "increase" : "decrease"} from average
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

interface ActivityItem {
  title: string;
  description: string;
  date: string;
  user?: string;
  meta?: string;
  rating?: number;
  status?: string;
  category?: string;
}

interface ActivityCardProps {
  title: string;
  items: ActivityItem[];
}

const ActivityCard = ({ title, items }: ActivityCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600">
                  {item.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium truncate">{item.title}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{item.description}</p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {item.user && (
                    <span className="text-xs text-gray-500">{item.user}</span>
                  )}
                  {item.rating !== undefined && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                  {item.status && (
                    <Badge variant={item.status === 'open' ? 'outline' : 'default'}>
                      {item.status}
                    </Badge>
                  )}
                  {item.category && (
                    <Badge variant="secondary">{item.category}</Badge>
                  )}
                  {item.meta && (
                    <span className="text-xs text-gray-500">{item.meta}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;