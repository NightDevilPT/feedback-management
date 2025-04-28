import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/src/components/ui/separator";
import { FMBreadcrumb } from "@/src/components/molecules/fm-breadcrumb";
import { ThemeToggle } from "@/src/components/molecules/theme-toggle";
import { ScrollArea } from "@/src/components/ui/scroll-area";

export default function SideBarContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="overflow-hidden">
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex w-full items-center gap-2 px-4">
						<div className="flex-1 flex w-full items-center gap-2">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 h-4"
							/>
							<FMBreadcrumb />
						</div>
						<ThemeToggle />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full h-full">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
