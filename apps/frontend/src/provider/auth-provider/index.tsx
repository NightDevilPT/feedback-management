"use client";

// lib/context/auth-context.ts
import {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/hooks/use-toast";
import useApi from "@/src/hooks/use-api";
import apiService from "@/src/services/api.service";

type User = {
	id: string;
	_id?: string;
	name: string;
	email: string;
	role: "user" | "admin";
};

type AuthContextType = {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isLoggingIn: boolean;
	isLoggingOut: boolean;
	isFetchingUser: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	fetchUser: () => Promise<void>;
  view: "grid" | "table";
  setView: React.Dispatch<React.SetStateAction<"grid" | "table">>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isFetchingUser, setIsFetchingUser] = useState(false);
	const [view, setView] = useState<"grid" | "table">("grid");

	const { post, isLoading } = useApi();
	const router = useRouter();
	const { toast } = useToast();

	const fetchUser = async () => {
		await setIsFetchingUser(true);
		try {
			const userData = await apiService.get<{ data: any }>("/user/me");

			await new Promise((resolve) => setTimeout(resolve, 1000));
			setUser({ ...userData.data, id: userData.data.userId });
		} catch (error) {
			setUser(null);
		} finally {
			setIsFetchingUser(false);
			setIsInitializing(false);
		}
	};

	const login = async (email: string, password: string) => {
		setIsLoggingIn(true);
		try {
			await post("/user/login", { email, password });
			await fetchUser();
			toast({
				title: "Login successful",
				description: "Welcome back!",
			});
		} catch (error: any) {
			toast({
				title: "Login failed",
				description: error.message || "Invalid credentials",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsLoggingIn(false);
		}
	};

	const logout = async () => {
		setIsLoggingOut(true);
		try {
			await post("/user/logout");
			setUser(null);
			toast({
				title: "Logged out",
				description: "You have been logged out successfully",
			});
		} catch (error: any) {
			toast({
				title: "Logout failed",
				description: error.message || "An error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoggingOut(false);
		}
	};

	const value = {
		user,
		isAuthenticated: !!user,
		isLoading: isLoading || isInitializing,
		isLoggingIn,
		isLoggingOut,
		isFetchingUser,
		login,
		logout,
		fetchUser,
    view,
    setView,
	};

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				await fetchUser();
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		initializeAuth();
	}, []);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export { AuthProvider, useAuth };
