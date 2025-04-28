"use client";

import * as React from "react";
import { sidebarNavGroups } from "./routes";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from "@/src/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import FMLogo from "@/src/components/molecules/fm-logo";
import { FMUserNav } from "@/src/components/molecules/fm-user-nav";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { FMNavSidebar } from "./nav-sidebar";
import { useAuth } from "../auth-provider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { state } = useSidebar();
	const { user } = useAuth();
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader
				className={`w-full !py-5 h-20 flex justify-center ${
					state === "collapsed" ? "items-center" : "items-start"
				}`}
			>
				<FMLogo />
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<ScrollArea className="w-full h-full">
					<FMNavSidebar navGroups={sidebarNavGroups} />
				</ScrollArea>
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				{user && <FMUserNav user={user} />}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
