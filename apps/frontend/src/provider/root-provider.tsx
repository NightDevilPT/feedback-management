"use client";

import { usePathname } from "next/navigation";
import SideBarContainer from "./sidebar-provider/sidebar-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import { ToastProvider } from "../components/ui/toast";

const noSidebarRoutes = [
	"/auth",
	"/auth/login",
	// Add other routes that shouldn't have sidebar
];

export default function RootProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const shouldShowSidebar = !noSidebarRoutes.some((route) =>
		pathname?.startsWith(route)
	);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{/* <ReduxProvider> */}
			<AuthProvider>
				<ToastProvider>
					{shouldShowSidebar ? (
						<SideBarContainer>{children}</SideBarContainer>
					) : (
						children
					)}
				</ToastProvider>
			</AuthProvider>
			{/* </ReduxProvider> */}
		</ThemeProvider>
	);
}
