import {
	Home,
	User,
	MessageSquare,
} from "lucide-react";
import { NavGroup } from "./nav-sidebar";

export const sidebarNavGroups: NavGroup[] = [
	// Common routes (accessible to all authenticated users)
	{
		items: [
			{
				title: "Dashboard",
				url: "/",
				icon: Home,
				isActive: true,
			},
			{
				title: "Users",
				url: "/users",
				icon: User,
			},
			{
				title: "Feedbacks",
				url: "/feedbacks",
				icon: MessageSquare,
			},
		],
	},
];
