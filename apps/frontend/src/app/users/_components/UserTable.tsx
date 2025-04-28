import FMTable, { ColumnConfig } from "@/src/components/molecules/fm-table";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import { Label } from "@/src/components/ui/label";
import { UserResponse } from "@/src/interface/user.interface";
import React from "react";
import { useRouter } from "next/navigation";

const UserTable = ({ data }: { data: UserResponse[] }) => {
	const router = useRouter();

	const userColumns: ColumnConfig<UserResponse>[] = [
		{
			field: "name",
			headerName: "Name",
			sortable: true,
			width: "200px",
			renderCell: (user) => (
				<div 
					className="flex w-full items-center justify-center gap-2 cursor-pointer hover:text-blue-600 hover:underline"
					onClick={() => router.push(`/users/${user.userId}`)}
				>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<span className="font-medium">{user.name}</span>
				</div>
			),
		},
		{
			field: "email",
			headerName: "Email",
			sortable: true,
			width: "250px",
			renderCell: (user) => (
				<Label>{user.email}</Label>
			),
		},
		{
			field: "role",
			headerName: "Role",
			sortable: true,
			width: "120px",
			renderCell: (user) => (
				<span
					className={`px-2 py-1 text-xs rounded-full ${
						user.role === "admin"
							? "bg-purple-100 text-purple-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{user.role}
				</span>
			),
		},
		{
			field: "feedbackCount",
			headerName: "Feedback",
			sortable: true,
			width: "120px",
			renderCell: (user) => (
				<div className="flex items-center justify-center gap-1">
					<span>{user.feedbackCount || 0}</span>
				</div>
			),
		},
		{
			field: "createdAt",
			headerName: "Joined",
			sortable: true,
			width: "150px",
			renderCell: (user) => (
				<span>{new Date(user.createdAt).toLocaleDateString()}</span>
			),
		},
	];

	return (
		<div className="w-full h-full">
			<FMTable
				columns={userColumns}
				data={data}
				showConfigMenu
				exportOptions={{ enabled: true }}
			/>
		</div>
	);
};

export default UserTable;
