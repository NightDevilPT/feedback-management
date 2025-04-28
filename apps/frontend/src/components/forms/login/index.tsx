"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useToast } from "@/src/hooks/use-toast";
import apiService from "@/src/services/api.service";
import { useAuth } from "@/src/provider/auth-provider";

// Define login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { toast } = useToast();
  const { fetchUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiService.post("/user/login", {
        email: data.email,
        password: data.password,
      });

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
        variant: "default",
      });
      fetchUser();

    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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

              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                </div>
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

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}