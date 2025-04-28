import { Mail, Star, Calendar, Shield } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { UserResponse } from "@/src/interface/user.interface";
import { useRouter } from "next/navigation";

interface UserCardProps {
	user: UserResponse;
	onEdit?: (user: UserResponse) => void;
	onDelete?: (userId: string) => void;
}

export const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
	const router = useRouter();

	return (
		<div 
			className="rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
			onClick={() => router.push(`/users/${user.userId}`)}
		>
			<div className="p-4">
				<div className="flex items-center space-x-4">
					<Avatar className="h-12 w-12">
						<AvatarImage
							src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
						/>
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-lg font-semibold hover:text-blue-600">{user.name}</h3>
						<div className="flex items-center text-sm text-gray-500">
							<Mail className="h-4 w-4 mr-1" />
							<a
								href={`mailto:${user.email}`}
								className="hover:underline"
								onClick={(e) => e.stopPropagation()}
							>
								{user.email}
							</a>
						</div>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-3">
					<div className="flex items-center">
						<Shield className="h-4 w-4 mr-2 text-gray-500" />
						<Badge
							variant={
								user.role === "admin"
									? "destructive"
									: "outline"
							}
						>
							{user.role}
						</Badge>
					</div>

					<div className="flex items-center">
						<Star className="h-4 w-4 mr-2 text-gray-500" />
						<span className="text-sm">
							{user.feedbackCount || 0} feedback
						</span>
					</div>

					<div className="flex items-center col-span-2">
						<Calendar className="h-4 w-4 mr-2 text-gray-500" />
						<span className="text-sm">
							Joined{" "}
							{new Date(user.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				{(onEdit || onDelete) && (
					<div className="mt-4 flex space-x-2" onClick={(e) => e.stopPropagation()}>
						{onEdit && (
							<Button
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => onEdit(user)}
							>
								Edit
							</Button>
						)}
						{onDelete && (
							<Button
								variant="outline"
								size="sm"
								className="flex-1 text-red-600 hover:text-red-700"
								onClick={() => onDelete(user.userId)}
							>
								Delete
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

// Grid view component that uses the UserCard
interface UsersGridViewProps {
	data: UserResponse[];
	onEdit?: (user: UserResponse) => void;
	onDelete?: (userId: string) => void;
}

export const UsersGridView = ({
	data,
	onEdit,
	onDelete,
}: UsersGridViewProps) => {
	return (
		<div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{data.map((user) => (
				<UserCard
					key={user.userId}
					user={user}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
};
