"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/src/hooks/use-toast";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import { cn } from "../../../lib/utils";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useAuth } from "@/src/provider/auth-provider";
import { Label } from "@radix-ui/react-dropdown-menu";
import useApi from "@/src/hooks/use-api";
import apiService from "@/src/services/api.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { UserRole } from "@/src/interface/user.interface";

// Define signup schema
const signupSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		type: z.enum(["user", "admin"]),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const { login } = useAuth();
	const { toast } = useToast();
	const { post, isLoading } = useApi();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupFormData) => {
		try {
			console.log(data, "data");
			// Call the signup API
			await apiService.post("/user/register", {
				name: data.name,
				email: data.email,
				role: data.type,
				password: data.password,
			});

			// Show success toast
			toast({
				title: "Account created successfully",
				description: "You can now log in to your account",
			});

			// If signup is successful, log in the user
			await login(data.email, data.password);
		} catch (error: any) {
			console.error("Signup error:", error);

			// Show error toast based on the error status
			toast({
				title: "Error",
				description: error.message || "Failed to create account",
				variant: "destructive",
			});
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">
						Create an account
					</CardTitle>
					<CardDescription>
						Enter your details to get started with FeedbackFlow
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-6">
							{/* Name Field */}
							<div className="grid gap-2">
								<Label>Full Name</Label>
								<Input
									id="name"
									placeholder="John Doe"
									{...register("name")}
								/>
								{errors.name && (
									<p className="text-sm text-destructive">
										{errors.name.message}
									</p>
								)}
							</div>

							{/* Email Field */}
							<div className="grid gap-2">
								<Label>Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>

							{/* User Type Field */}
							<Select
								defaultValue={UserRole.USER}
								onValueChange={(value) => {
									setValue("type", value as UserRole);
								}}
							>
								<SelectTrigger className="bg-transparent">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(UserRole).map(
										(category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{category
													.charAt(0)
													.toUpperCase() +
													category.slice(1)}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
							{errors.type && (
								<p className="text-red-600 text-sm">
									{errors.type.message}
								</p>
							)}

							{/* Password Field */}
							<div className="grid gap-2">
								<Label>Password</Label>
								<Input
									id="password"
									type="password"
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Confirm Password Field */}
							<div className="grid gap-2">
								<Label>Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword && (
									<p className="text-sm text-destructive">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating account...
									</>
								) : (
									"Sign Up"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
