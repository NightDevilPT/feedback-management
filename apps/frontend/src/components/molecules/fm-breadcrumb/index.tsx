"use client";

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

interface BreadcrumbItem {
	label: string;
	href: string;
}

export function FMBreadcrumb() {
	const router = useRouter();
	const pathname = usePathname();
	const MAX_ITEMS = 3; // Maximum breadcrumbs to show before collapsing

	// Generate breadcrumb items from pathname
	const pathSegments = pathname.split("/").filter(Boolean);
	const breadcrumbItems: BreadcrumbItem[] = pathSegments.map(
		(segment, index) => ({
			label:
				segment.charAt(0).toUpperCase() +
				segment.slice(1).replace(/-/g, " "),
			href: "/" + pathSegments.slice(0, index + 1).join("/"),
		})
	);

	// Always include home as the first item
	const allItems = [{ label: "Home", href: "/" }, ...breadcrumbItems];

	// Function to handle navigation
	const handleNavigation = (href: string) => {
		router.push(href);
	};

	// Determine if we need to collapse items
	const shouldCollapse = allItems.length > MAX_ITEMS;
	const collapsedItems = shouldCollapse ? allItems.slice(1, -1) : [];
	const visibleItems = shouldCollapse
		? [allItems[0], allItems[allItems.length - 1]]
		: allItems;

	return (
		<Breadcrumb className="py-1">
			<BreadcrumbList>
				{visibleItems.map((item, index) => (
					<div key={item.href} className="flex items-center">
						{index > 0 && <BreadcrumbSeparator />}

						{index === 0 && shouldCollapse ? (
							<>
								<BreadcrumbItem>
									<BreadcrumbLink
										onClick={() =>
											handleNavigation(item.href)
										}
										className="cursor-pointer hover:underline"
									>
										{item.label}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<DropdownMenu>
										<DropdownMenuTrigger className="flex items-center gap-1">
											<BreadcrumbEllipsis className="h-4 w-4" />
											<span className="sr-only">
												Toggle menu
											</span>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start">
											{collapsedItems.map(
												(collapsedItem) => (
													<DropdownMenuItem
														key={collapsedItem.href}
														onClick={() =>
															handleNavigation(
																collapsedItem.href
															)
														}
														className="cursor-pointer"
													>
														{collapsedItem.label}
													</DropdownMenuItem>
												)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</BreadcrumbItem>
							</>
						) : index === visibleItems.length - 1 ? (
							<BreadcrumbItem>
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							</BreadcrumbItem>
						) : (
							<BreadcrumbItem>
								<BreadcrumbLink
									onClick={() => handleNavigation(item.href)}
									className="cursor-pointer hover:underline"
								>
									{item.label}
								</BreadcrumbLink>
							</BreadcrumbItem>
						)}
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
