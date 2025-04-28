"use client";

import Link from "next/link";
import { ChevronRight, ChevronsUpDown, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/src/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";

export type NavSubItem = {
	title: string;
	url: string;
	isActive?: boolean;
	icon?: LucideIcon; // Add icon to NavSubItem
	roles?: ("CANDIDATE" | "RECRUITER" | "ADMIN")[];
};

export type NavItem = {
	title: string;
	url?: string;
	icon?: LucideIcon;
	isActive?: boolean;
	badge?: string | number; // For notification counts
	items?: NavSubItem[];
	roles?: ("CANDIDATE" | "RECRUITER" | "ADMIN")[];
};

export type NavGroup = {
	groupTitle?: string;
	items: NavItem[];
	roles?: ("CANDIDATE" | "RECRUITER" | "ADMIN")[];
};

interface NavMainProps {
	navGroups: NavGroup[];
}

export function FMNavSidebar({ navGroups }: NavMainProps) {
	const { state } = useSidebar();
	const [isMounted, setIsMounted] = useState(false);
	const { user } = {
		user: {
			isAdmin: true,
			userType: "ADMIN",
		},
	}; // Get current user from auth context

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	// Helper function to check if user has access to a nav item
	const hasAccess = (roles?: string[]) => {
		if (!roles || roles.length === 0) return true;
		if (!user) return false;
		if (user.isAdmin) return true;
		return roles.includes(user.userType);
	};

	return (
		<div className="space-y-6">
			{navGroups
				.filter((group) => hasAccess(group.roles))
				.map((group, groupIndex) => (
					<SidebarGroup
						key={group.groupTitle || `group-${groupIndex}`}
					>
						{group.groupTitle && state !== "collapsed" && (
							<SidebarGroupLabel>
								{group.groupTitle}
							</SidebarGroupLabel>
						)}
						<SidebarMenu>
							{group.items
								.filter((item) => hasAccess(item.roles))
								.map((item) => (
									<SidebarMenuItem key={item.title}>
										{item.items ? (
											state === "collapsed" ? (
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<SidebarMenuButton
															tooltip={item.title}
															className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
														>
															{item.icon && (
																<item.icon className="w-4 h-4" />
															)}
															<span className="sr-only">
																{item.title}
															</span>
															<ChevronsUpDown className="ml-auto size-4" />
														</SidebarMenuButton>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
														side="right"
														align="start"
														sideOffset={4}
													>
														{item.items
															.filter((subItem) =>
																hasAccess(
																	subItem.roles
																)
															)
															.map((subItem) => (
																<DropdownMenuItem
																	key={
																		subItem.title
																	}
																	asChild
																>
																	<Link
																		href={
																			subItem.url
																		}
																	>
																		<span>
																			{
																				subItem.title
																			}
																		</span>
																	</Link>
																</DropdownMenuItem>
															))}
													</DropdownMenuContent>
												</DropdownMenu>
											) : (
												<Collapsible
													defaultOpen={item.isActive}
													className="group/collapsible transition-all duration-300"
												>
													<CollapsibleTrigger asChild>
														<SidebarMenuButton
															tooltip={item.title}
														>
															{item.icon && (
																<item.icon className="w-4 h-4" />
															)}
															<span>
																{item.title}
															</span>
															<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
														</SidebarMenuButton>
													</CollapsibleTrigger>
													<CollapsibleContent asChild>
														<SidebarMenuSub>
															{item.items
																.filter(
																	(subItem) =>
																		hasAccess(
																			subItem.roles
																		)
																)
																.map(
																	(
																		subItem
																	) => (
																		<SidebarMenuSubItem
																			key={
																				subItem.title
																			}
																		>
																			<SidebarMenuSubButton
																				asChild
																			>
																				<Link
																					href={
																						subItem.url
																					}
																				>
																					<span>
																						{
																							subItem.title
																						}
																					</span>
																				</Link>
																			</SidebarMenuSubButton>
																		</SidebarMenuSubItem>
																	)
																)}
														</SidebarMenuSub>
													</CollapsibleContent>
												</Collapsible>
											)
										) : (
											<SidebarMenuButton
												asChild
												tooltip={item.title}
											>
												{item.url ? (
													<Link href={item.url}>
														{item.icon && (
															<item.icon className="w-4 h-4" />
														)}
														{state !==
															"collapsed" && (
															<span>
																{item.title}
															</span>
														)}
													</Link>
												) : (
													<>
														{item.icon && (
															<item.icon className="w-4 h-4" />
														)}
														{state !==
															"collapsed" && (
															<span>
																{item.title}
															</span>
														)}
													</>
												)}
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
						</SidebarMenu>
					</SidebarGroup>
				))}
		</div>
	);
}
