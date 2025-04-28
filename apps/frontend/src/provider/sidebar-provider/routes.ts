import {
	Home,
	Briefcase,
	User,
	Users,
	FileText,
	Bookmark,
	Mail,
	Bell,
	BarChart2,
	Settings,
	FileBadge,
	GraduationCap,
	Clock,
	Star,
	CreditCard,
	Tag,
	ClipboardList,
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
		],
	},
];
