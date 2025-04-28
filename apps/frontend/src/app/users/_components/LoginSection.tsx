import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { LoginForm } from "@/src/components/forms/login";
import { SignupForm } from "@/src/components/forms/signup";



export function LoginSection() {
	return (
		<Tabs defaultValue="signin" className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="signin">SignIn</TabsTrigger>
				<TabsTrigger value="signup">SignUp</TabsTrigger>
			</TabsList>
			<TabsContent value="signin">
				<LoginForm />
			</TabsContent>
			<TabsContent value="signup">
				<SignupForm />
			</TabsContent>
		</Tabs>
	);
}
